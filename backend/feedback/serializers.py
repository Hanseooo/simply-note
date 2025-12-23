# feedback/serializers.py
from rest_framework import serializers
from .models import Feedback

class FeedbackCreateSerializer(serializers.Serializer):
    feedback_type = serializers.ChoiceField(
        choices=["rating", "bug", "suggestion"]
    )
    rating = serializers.IntegerField(
        min_value=1, max_value=5, required=False
    )
    message = serializers.CharField(required=False, allow_blank=True)
    context = serializers.CharField(required=False, allow_blank=True)
    is_anonymous = serializers.BooleanField(default=False)

    def validate(self, data):
        if data["feedback_type"] == "rating":
            if "rating" not in data:
                raise serializers.ValidationError(
                    {"rating": "Rating is required"}
                )
        else:
            if not data.get("message"):
                raise serializers.ValidationError(
                    {"message": "Message is required"}
                )
        return data
