import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .services.gemini_client import generate_json_content
from .prompts.summarize_notes import SYSTEM_PROMPT, build_summarize_prompt
from .serializers import SummarySerializer
from rest_framework.permissions import IsAuthenticated
from ai.throttles import AIGenerationBurstThrottle
from ai.services.quota import AIQuotaService
from google.genai.errors import ServerError
from datetime import timedelta
from django.utils import timezone


from ai.services.quota import AIQuotaService
from ai.constants import AICreditCost
from ai.models import AIQuotaBucket



class SummarizeNotesAPIView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [AIGenerationBurstThrottle]
    def post(self, request):
        original_text = request.data.get("text")

        if not original_text:
            return Response(
                {"detail": "Text is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        try:
            raw_output = generate_json_content(
                system_prompt=SYSTEM_PROMPT,
                user_prompt=build_summarize_prompt(original_text),
                thinking_budget=-1,
            )

        except ServerError as e:
            if e.status == "UNAVAILABLE":
                return Response(
                    {"detail": "AI service is temporarily unavailable. Please try again later."},
                    status=status.HTTP_503_SERVICE_UNAVAILABLE
                )
            raise
        

        # Safe JSON parse (backend version of your TS function)
        try:
            parsed = json.loads(raw_output)

        except json.JSONDecodeError:
            return Response(
                {
                    "detail": "AI returned invalid JSON",
                    "raw": raw_output
                },
                status=status.HTTP_502_BAD_GATEWAY
            )
        

        serializer = SummarySerializer(data=parsed)
        if not serializer.is_valid():
            return Response(
                {
                    "detail": "AI output schema mismatch",
                    "errors": serializer.errors,
                    "raw": parsed
                },
                status=status.HTTP_502_BAD_GATEWAY
            )
        AIQuotaService.consume(
             user=request.user,
            bucket=AIQuotaBucket.BUCKET_GENERAL,
            cost=AICreditCost.SUMMARIZE_FLASH_LITE,
        )

        return Response(serializer.validated_data)

from django.db import transaction

class AIQuotaStatusAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        AIQuotaService.ensure_all_buckets(request.user)

        now = timezone.now()
        data = []

        with transaction.atomic():
            quotas = (
                AIQuotaBucket.objects
                .select_for_update()
                .filter(user=request.user)
            )

            for quota in quotas:
                window_end = quota.window_started_at + timedelta(
                    hours=quota.window_hours
                )

                if now >= window_end:
                    quota.window_started_at = now
                    quota.used_credits = 0
                    quota.save(update_fields=[
                        "window_started_at",
                        "used_credits",
                        "updated_at",
                    ])
                    window_end = now + timedelta(hours=quota.window_hours)

                data.append({
                    "bucket": quota.bucket,
                    "used_credits": quota.used_credits,
                    "max_credits": quota.max_credits,
                    "remaining_credits": max(
                        quota.max_credits - quota.used_credits, 0
                    ),
                    "window_ends_at": window_end,
                    "seconds_until_reset": max(
                        int((window_end - now).total_seconds()), 0
                    ),
                })

        return Response(data)
