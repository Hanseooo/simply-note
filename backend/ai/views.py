import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from .services.gemini_client import generate_json_content
from .prompts.summarize_notes import SYSTEM_PROMPT
from .serializers import SummarySerializer
from rest_framework.permissions import IsAuthenticated
from ai.throttles import AISummarizeBurstThrottle
from ai.services.quota import AIQuotaService
from google.genai.errors import ServerError


class SummarizeNotesAPIView(APIView):
    permission_classes = [IsAuthenticated]
    throttle_classes = [AISummarizeBurstThrottle]
    def post(self, request):
        original_text = request.data.get("text")
        # AIQuotaService.check_and_consume(
        #     user=request.user,
        #     action="summarize",
        # )

        if not original_text:
            return Response(
                {"detail": "Text is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            raw_output = generate_json_content(
                system_prompt=SYSTEM_PROMPT,
                user_prompt=original_text,
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

        return Response(serializer.validated_data)
