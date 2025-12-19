# summaries/views.py
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from django.shortcuts import get_object_or_404

from .models import Summary, SavedSummary
from .serializers import SummaryCreateSerializer, SummaryDetailSerializer, SavedSummaryListSerializer, SavedSummaryMinimalSerializer


class SaveSummaryAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = SummaryCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        summary = Summary.objects.create(
            created_by=request.user,
            **serializer.validated_data
        )

        SavedSummary.objects.create(
            user=request.user,
            summary=summary
        )

        return Response(
            SummaryDetailSerializer(
                summary,
                context={"request": request}
            ).data,
            status=status.HTTP_201_CREATED
        )

class SaveExistingSummaryAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, summary_id):
        summary = get_object_or_404(Summary, id=summary_id)

        SavedSummary.objects.get_or_create(
            user=request.user,
            summary=summary
        )

        return Response({"detail": "Saved"}, status=status.HTTP_200_OK)


class UnsaveSummaryAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, summary_id):
        saved = SavedSummary.objects.filter(
            user=request.user,
            summary_id=summary_id
        )

        if not saved.exists():
            return Response(
                {"detail": "Not saved"},
                status=status.HTTP_400_BAD_REQUEST
            )

        saved.delete()

        if not SavedSummary.objects.filter(summary_id=summary_id).exists():
            Summary.objects.filter(id=summary_id).delete()

        return Response(status=status.HTTP_204_NO_CONTENT)


class SummaryByCodeAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, code):
        summary = get_object_or_404(Summary, share_code=code)

        return Response(
            SummaryDetailSerializer(
                summary,
                context={"request": request}
            ).data
        )


class PinSummaryAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, summary_id):
        saved = get_object_or_404(
            SavedSummary,
            user=request.user,
            summary_id=summary_id
        )

        saved.is_pinned = True
        saved.save(update_fields=["is_pinned"])

        return Response({"detail": "Pinned"}, status=status.HTTP_200_OK)

class UnpinSummaryAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, summary_id):
        saved = get_object_or_404(
            SavedSummary,
            user=request.user,
            summary_id=summary_id
        )

        saved.is_pinned = False
        saved.save(update_fields=["is_pinned"])

        return Response({"detail": "Unpinned"}, status=status.HTTP_200_OK)

class UserSavedSummariesAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        pinned_only = request.query_params.get("pinned")

        queryset = SavedSummary.objects.select_related(
            "summary",
            "summary__created_by"
        ).filter(user=request.user)

        if pinned_only == "true":
            queryset = queryset.filter(is_pinned=True)

        serializer = SavedSummaryListSerializer(queryset, many=True)
        return Response(serializer.data)


class UserSavedSummariesMinimalAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        queryset = (
            SavedSummary.objects
            .select_related("summary", "summary__created_by")
            .filter(user=request.user)
            .order_by("saved_at")
        )

        serializer = SavedSummaryMinimalSerializer(queryset, many=True)
        return Response(serializer.data)