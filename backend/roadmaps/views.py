from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from .models import Roadmap, RoadmapUserLink
from .serializers import RoadmapDetailSerializer, SavedRoadmapListSerializer, RoadmapShareResolveSerializer
from .services.roadmap_generator import generate_roadmap, RoadmapGenerationError
from django.utils import timezone
from datetime import timedelta

class GenerateRoadmapAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        topic = request.data.get("topic")
        diagram_type = request.data.get("diagram_type")

        if not topic or diagram_type not in {"flowchart", "gantt", "timeline"}:
            return Response(
                {"detail": "Invalid input"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Cleanup old unsaved temporary roadmaps
        cutoff = timezone.now() - timedelta(minutes=30)
        Roadmap.objects.filter(is_temporary=True, created_at__lt=cutoff).exclude(
            user_links__isnull=False
        ).delete()

        try:
            roadmap_data = generate_roadmap(
                topic=topic,
                diagram_type=diagram_type,
            )
        except RoadmapGenerationError as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        # Save generated roadmap to DB
        roadmap = Roadmap.objects.create(
            title=roadmap_data["title"],
            description=roadmap_data["description"],
            markdown=roadmap_data["markdown"],
            diagram_type=roadmap_data["diagram"]["type"],
            diagram_code=roadmap_data["diagram"]["code"],
            milestones=roadmap_data.get("milestones", []),
            created_by=request.user,
            is_temporary=True,  
        )

        serializer = RoadmapDetailSerializer(roadmap, context={"request": request})
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class SaveRoadmapAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, roadmap_id):
        roadmap = Roadmap.objects.get(id=roadmap_id)

        RoadmapUserLink.objects.get_or_create(
            user=request.user,
            roadmap=roadmap,
        )

        return Response({"detail": "Saved"}, status=status.HTTP_200_OK)

class UnsaveRoadmapAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, roadmap_id):
        RoadmapUserLink.objects.filter(
            user=request.user,
            roadmap_id=roadmap_id,
        ).delete()

        return Response(status=status.HTTP_204_NO_CONTENT)


class PinRoadmapAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, roadmap_id):
        link = RoadmapUserLink.objects.get(
            user=request.user,
            roadmap_id=roadmap_id,
        )
        link.is_pinned = True
        link.save(update_fields=["is_pinned"])

        return Response({"detail": "Pinned"}, status=status.HTTP_200_OK)


class UnpinRoadmapAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, roadmap_id):
        link = RoadmapUserLink.objects.get(
            user=request.user,
            roadmap_id=roadmap_id,
        )
        link.is_pinned = False
        link.save(update_fields=["is_pinned"])

        return Response({"detail": "Unpinned"}, status=status.HTTP_200_OK)


class MySavedRoadmapsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        pinned_only = request.query_params.get("pinned") == "true"

        qs = Roadmap.objects.filter(
            user_links__user=request.user
        )

        if pinned_only:
            qs = qs.filter(user_links__is_pinned=True)

        qs = qs.select_related("created_by").distinct()

        serializer = SavedRoadmapListSerializer(
            qs, many=True, context={"request": request}
        )
        return Response(serializer.data)


class RoadmapByCodeAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, code):
        roadmap = get_object_or_404(Roadmap, share_code=code)

        serializer = RoadmapShareResolveSerializer(roadmap)
        return Response(serializer.data)

class RoadmapDetailAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, roadmap_id):
        roadmap = get_object_or_404(Roadmap, id=roadmap_id)

        # Optional: attach user-specific state (is_saved, is_pinned)
        link = RoadmapUserLink.objects.filter(
            roadmap=roadmap,
            user=request.user,
        ).first()

        serializer = RoadmapDetailSerializer(
            roadmap,
            context={
                "request": request,
                "user_link": link,
            },
        )

        return Response(serializer.data, status=status.HTTP_200_OK)