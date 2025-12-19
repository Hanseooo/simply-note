# roadmaps/serializers.py
from rest_framework import serializers
from .models import Roadmap, RoadmapUserLink


class RoadmapDetailSerializer(serializers.ModelSerializer):
    is_saved = serializers.SerializerMethodField()
    is_pinned = serializers.SerializerMethodField()

    class Meta:
        model = Roadmap
        fields = [
            "id",
            "title",
            "description",
            "markdown",
            "diagram_type",
            "diagram_code",
            "milestones",
            "share_code",
            "created_by",
            "created_at",
            "is_saved",
            "is_pinned",
        ]

    def get_is_saved(self, obj):
        user = self.context["request"].user
        return obj.user_links.filter(user=user).exists()

    def get_is_pinned(self, obj):
        user = self.context["request"].user
        link = obj.user_links.filter(user=user).first()
        return link.is_pinned if link else False

class SaveRoadmapSerializer(serializers.Serializer):
    roadmap_id = serializers.UUIDField()


class RoadmapShareSerializer(serializers.ModelSerializer):
    class Meta:
        model = Roadmap
        fields = [
            "title",
            "description",
            "markdown",
            "diagram_type",
            "diagram_code",
            "milestones",
            "share_code",
            "created_by",
        ]

class SavedRoadmapListSerializer(serializers.ModelSerializer):
    is_pinned = serializers.SerializerMethodField()
    created_by = serializers.StringRelatedField()

    class Meta:
        model = Roadmap
        fields = [
            "id",
            "title",
            "diagram_type",
            "share_code",
            "created_by",
            "created_at",
            "is_pinned",
        ]

    def get_is_pinned(self, obj):
        user = self.context["request"].user
        link = obj.user_links.filter(user=user).only("is_pinned").first()
        return link.is_pinned if link else False
    
class RoadmapShareResolveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Roadmap
        fields = ["id"]