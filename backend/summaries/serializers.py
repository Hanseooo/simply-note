from rest_framework import serializers
from .models import Summary, SavedSummary


class SummaryCreateSerializer(serializers.ModelSerializer):
    """
    Used when saving a generated summary to the DB
    """
    class Meta:
        model = Summary
        fields = (
            "id",
            "share_code",
            "title",
            "description",
            "markdown",
            "key_points",
            "topics",
            "difficulty",
            "word_count",
        )
        read_only_fields = ("id", "share_code")


class SummaryDetailSerializer(serializers.ModelSerializer):
    created_by = serializers.CharField(
        source="created_by.username",
        read_only=True
    )

    is_saved = serializers.SerializerMethodField()
    is_pinned = serializers.SerializerMethodField()

    class Meta:
        model = Summary
        fields = (
            "id",
            "share_code",
            "title",
            "description",
            "markdown",
            "key_points",
            "topics",
            "difficulty",
            "word_count",
            "created_by",
            "is_saved",
            "is_pinned",
        )

    def get_is_saved(self, obj):
        user = self.context["request"].user
        return obj.saved_by.filter(user=user).exists()

    def get_is_pinned(self, obj):
        user = self.context["request"].user
        link = obj.saved_by.filter(user=user).first()
        return link.is_pinned if link else False


class SavedSummaryListSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(source="summary.id")
    share_code = serializers.CharField(source="summary.share_code")
    title = serializers.CharField(source="summary.title")
    topics = serializers.ListField(source="summary.topics")
    difficulty = serializers.CharField(source="summary.difficulty")
    created_at = serializers.DateTimeField(source="summary.created_at")

    created_by = serializers.SerializerMethodField()
    is_pinned = serializers.BooleanField()

    class Meta:
        model = SavedSummary
        fields = [
            "id",
            "share_code",
            "title",
            "topics",
            "difficulty",
            "created_at",
            "created_by",
            "is_pinned",
        ]

    def get_created_by(self, obj):
        return {
            "username": obj.summary.created_by.username
        }
    
class SavedSummaryMinimalSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField(source="summary.id")
    title = serializers.CharField(source="summary.title")
    created_by = serializers.CharField(
        source="summary.created_by.username"
    )

    class Meta:
        model = SavedSummary
        fields = [
            "id",
            "title",
            "created_by",
        ]