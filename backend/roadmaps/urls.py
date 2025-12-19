# roadmaps/urls.py
from django.urls import path
from .views import (
    GenerateRoadmapAPIView,
    SaveRoadmapAPIView,
    UnsaveRoadmapAPIView,
    PinRoadmapAPIView,
    UnpinRoadmapAPIView,
    MySavedRoadmapsAPIView,
    RoadmapByCodeAPIView,
    RoadmapDetailAPIView
)

urlpatterns = [
    path("generate/", GenerateRoadmapAPIView.as_view()),

    path("<uuid:roadmap_id>/save/", SaveRoadmapAPIView.as_view()),
    path("<uuid:roadmap_id>/unsave/", UnsaveRoadmapAPIView.as_view()),

    path("<uuid:roadmap_id>/pin/", PinRoadmapAPIView.as_view()),
    path("<uuid:roadmap_id>/unpin/", UnpinRoadmapAPIView.as_view()),

    path("saved/", MySavedRoadmapsAPIView.as_view()),
    path("share/<str:code>/", RoadmapByCodeAPIView.as_view()),

    path(
        "<uuid:roadmap_id>/",
        RoadmapDetailAPIView.as_view(),
        name="roadmap-detail",
    ),
]
