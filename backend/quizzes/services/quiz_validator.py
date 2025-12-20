from rest_framework import serializers

class QuizQuestionSerializer(serializers.Serializer):
    id = serializers.CharField()
    type = serializers.ChoiceField(choices=[
        "multiple_choice",
        "true_false",
        "identification",
        "fill_blank",
    ])
    topic_id = serializers.CharField()
    question = serializers.CharField()
    choices = serializers.ListField(
        child=serializers.CharField(),
        allow_null=True,
        required=False,
    )
    answer = serializers.JSONField()
    explanation = serializers.CharField()

    def validate(self, data):
        qtype = data["type"]
        choices = data.get("choices")

        if qtype == "multiple_choice":
            if not choices or len(choices) != 4:
                raise serializers.ValidationError(
                    "multiple_choice must have exactly 4 choices"
                )
        else:
            if choices not in (None, []):
                raise serializers.ValidationError(
                    f"{qtype} must not have choices"
                )

        return data



class QuizContentSerializer(serializers.Serializer):
    title = serializers.CharField()
    difficulty = serializers.ChoiceField(choices=["easy", "medium", "hard"])
    topics = serializers.ListField(
        child=serializers.DictField(child=serializers.CharField())
    )
    questions = QuizQuestionSerializer(many=True)

    def validate(self, data):
        topic_ids = {t["id"] for t in data["topics"]}

        for q in data["questions"]:
            if q["topic_id"] not in topic_ids:
                raise serializers.ValidationError(
                    f"Invalid topic_id {q['topic_id']}"
                )

        return data

