from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Feedback
from .serializers import FeedbackCreateSerializer
from .utils import can_submit_feedback
from datetime import timezone

from rest_framework.pagination import PageNumberPagination


class FeedbackPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = "page_size"
    max_page_size = 100


class FeedbackView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = FeedbackCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        is_anonymous = serializer.validated_data.pop("is_anonymous")
        feedback_type = serializer.validated_data.get("feedback_type")

        user = None if is_anonymous else request.user

        # Cooldown applies only to authenticated users
        if user and not can_submit_feedback(user):
            return Response(
                {"detail": "You can only submit feedback once every 3 days."},
                status=status.HTTP_429_TOO_MANY_REQUESTS,
            )

        # 🔒 Prevent duplicate ratings
        if feedback_type == "rating" and user:
            existing = Feedback.objects.filter(
                user=user,
                feedback_type="rating",
            ).first()

            if existing:
                existing.rating = serializer.validated_data["rating"]
                existing.context = serializer.validated_data.get("context", "")
                existing.created_at = timezone.now()
                existing.save(
                    update_fields=["rating", "context", "created_at"]
                )

                return Response(
                    {"detail": "Rating updated successfully"},
                    status=status.HTTP_200_OK,
                )

        Feedback.objects.create(
            user=user,
            is_anonymous=is_anonymous,
            **serializer.validated_data,
        )

        return Response(
            {"detail": "Feedback submitted successfully"},
            status=status.HTTP_201_CREATED,
        )

    def get(self, request):
        qs = Feedback.objects.select_related("user").order_by("-created_at")

        feedback_type = request.query_params.get("feedback_type")
        rating = request.query_params.get("rating")
        context = request.query_params.get("context")

        if feedback_type:
            qs = qs.filter(feedback_type=feedback_type)

        if rating:
            qs = qs.filter(rating=rating)

        if context:
            qs = qs.filter(context=context)

        paginator = FeedbackPagination()
        page = paginator.paginate_queryset(qs, request)

        data = [
            {
                "id": f.id,
                "feedback_type": f.feedback_type,
                "rating": f.rating,
                "message": f.message,
                "context": f.context,
                "username": f.user.username if f.user else "Anonymous",
                "created_at": f.created_at,
            }
            for f in page
        ]

        return paginator.get_paginated_response(data)


class MyRatingView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        feedback = Feedback.objects.filter(
            user=request.user,
            feedback_type="rating",
        ).first()

        if not feedback:
            return Response({"rating": None})

        return Response({
            "rating": feedback.rating,
            "updated_at": feedback.created_at,
        })
