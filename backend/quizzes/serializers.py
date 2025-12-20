from rest_framework import serializers
from .models import QuizUser, Quiz

class GenerateQuizSerializer(serializers.Serializer):
    summary_id = serializers.UUIDField()
    options = serializers.JSONField()



class SavedQuizSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(source="quiz.id")
    title = serializers.CharField(source="quiz.title")
    difficulty = serializers.CharField(source="quiz.difficulty")
    created_by = serializers.CharField(source="quiz.generated_by.username")
    share_code = serializers.CharField(source="quiz.share_code")
    topics = serializers.JSONField(source="quiz.topics")

    class Meta:
        model = QuizUser
        fields = [
            "id",
            "title",
            "difficulty",
            "created_by",
            "is_pinned",
            "linked_at",
            "share_code",
            "topics"
        ]

class QuizDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = [
            "id",
            "title",
            "difficulty",
            "content",   # full quiz JSON (questions)
            "topics",    # topic metadata
            "created_at",
        ]