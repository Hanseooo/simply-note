from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .services.roadmap_generator import generate_roadmap, RoadmapGenerationError


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

        try:
            roadmap = generate_roadmap(
                topic=topic,
                diagram_type=diagram_type,
            )
        except RoadmapGenerationError as e:
            return Response(
                {"detail": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

        return Response(roadmap, status=status.HTTP_200_OK)
