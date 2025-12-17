from rest_framework import serializers

class SummarySerializer(serializers.Serializer):
    title = serializers.CharField()
    description = serializers.CharField()
    markdown = serializers.CharField()
    key_points = serializers.ListField(
        child=serializers.CharField()
    )
    topics = serializers.ListField(
        child=serializers.CharField()
    )
    difficulty = serializers.ChoiceField(
        choices=[    
            ("beginner", "Beginner"),
            ("intermediate", "Intermediate"),
            ("advanced", "Advanced"),
            ]
    )
    word_count = serializers.IntegerField()
