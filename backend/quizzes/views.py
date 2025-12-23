import uuid
import json
from django.utils.crypto import get_random_string
from django.shortcuts import get_object_or_404
from django.db import transaction, models
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import NotFound

from summaries.models import Summary
from .models import Quiz, QuizUser
from .serializers import GenerateQuizSerializer, SavedQuizSerializer, QuizDetailSerializer
from .services.quiz_generator import generate_quiz_ai
from .services.quiz_validator import QuizContentSerializer

from django.utils.timezone import now
from datetime import timedelta


from ai.services.quota import AIQuotaService
from ai.constants import AICreditCost
from ai.models import AIQuotaBucket
from ai.throttles import AIGenerationBurstThrottle

def cleanup_orphan_quizzes():
    threshold = now() - timedelta(minutes=15)

    Quiz.objects.annotate(
    user_count=models.Count("linked_users")
).filter(
    user_count=0,
    created_at__lt=threshold,
).delete()




class GenerateQuizView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [AIGenerationBurstThrottle]
    def post(self, request):

        serializer = GenerateQuizSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        cleanup_orphan_quizzes()

        summary = get_object_or_404(
            Summary,
            id=serializer.validated_data["summary_id"],
            created_by=request.user,
        )

        options = serializer.validated_data["options"]

        # Generate quiz
        raw_json = generate_quiz_ai(
            summary=summary,
            options=options,
        )

        try:
            quiz_data = json.loads(raw_json)
        except json.JSONDecodeError:
            return Response(
                {"error": "Invalid AI output"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        # Validate structure
        validator = QuizContentSerializer(data=quiz_data)
        validator.is_valid(raise_exception=True)

        AIQuotaService.consume(
            user=request.user,
            bucket=AIQuotaBucket.BUCKET_QUIZ,
            cost=AICreditCost.QUIZ_GENERATION,
        )

        # Atomic save
        with transaction.atomic():
            quiz = Quiz.objects.create(
                summary=summary,
                generated_by=request.user,
                title=quiz_data["title"],
                difficulty=quiz_data["difficulty"],
                options=options,
                content=quiz_data,
                topics=quiz_data["topics"],
                share_code=get_random_string(10),
            )

            QuizUser.objects.create(
                quiz=quiz,
                user=request.user,
            )

        return Response(
            {
                "quiz_id": quiz.id,
                "share_code": quiz.share_code,
            },
            status=status.HTTP_201_CREATED,
        )



class QuizByCodeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, code):
        quiz = get_object_or_404(Quiz, share_code=code)

        # Auto-link user
        QuizUser.objects.get_or_create(
            quiz=quiz,
            user=request.user,
        )

        return Response(
            {
                "id": quiz.id,
                "title": quiz.title,
                "difficulty": quiz.difficulty,
                "content": quiz.content,
                "topics": quiz.topics,
            }
        )


class PinQuizView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, quiz_id):
        quiz_user = get_object_or_404(
            QuizUser,
            quiz_id=quiz_id,
            user=request.user,
        )

        quiz_user.is_pinned = True
        quiz_user.save(update_fields=["is_pinned"])

        return Response({"success": True})


class UnpinQuizView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, quiz_id):
        quiz_user = get_object_or_404(
            QuizUser,
            quiz_id=quiz_id,
            user=request.user,
        )

        quiz_user.is_pinned = False
        quiz_user.save(update_fields=["is_pinned"])

        return Response({"success": True})


class UnsaveQuizView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, quiz_id):
        quiz_user = get_object_or_404(
            QuizUser,
            quiz_id=quiz_id,
            user=request.user,
        )

        quiz_user.delete()

        return Response(status=status.HTTP_204_NO_CONTENT)


class SavedQuizzesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        quizzes = (
            QuizUser.objects
            .filter(user=request.user)
            .select_related("quiz", "quiz__generated_by")
            .order_by("-is_pinned", "-linked_at")
        )

        serializer = SavedQuizSerializer(quizzes, many=True)
        return Response(serializer.data)


class QuizDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, quiz_id):
        # User must either:
        # 1. be the generator
        # 2. OR have a QuizUser link
        quiz = (
            Quiz.objects
            .filter(id=quiz_id)
            .filter(
                models.Q(generated_by=request.user)
                | models.Q(linked_users__user=request.user)
            )
            .distinct()
            .first()
        )

        if not quiz:
            raise NotFound("Quiz not found or inaccessible.")

        serializer = QuizDetailSerializer(quiz)
        return Response(serializer.data)