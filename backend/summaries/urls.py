from django.urls import path
from .views import (
    SaveSummaryAPIView,
    SaveExistingSummaryAPIView,
    UnsaveSummaryAPIView,
    SummaryByCodeAPIView,
    PinSummaryAPIView,
    UnpinSummaryAPIView,
    UserSavedSummariesAPIView
)

urlpatterns = [
    path("save/", SaveSummaryAPIView.as_view()),
    path("save/<uuid:summary_id>/save/", SaveExistingSummaryAPIView.as_view()),

    path("modify/<uuid:summary_id>/unsave/", UnsaveSummaryAPIView.as_view()),
    path("modify/<uuid:summary_id>/pin/", PinSummaryAPIView.as_view()),
    path("modify/<uuid:summary_id>/unpin/", UnpinSummaryAPIView.as_view()),

    path("search/by-code/<str:code>/", SummaryByCodeAPIView.as_view()),
    path("me/saved/", UserSavedSummariesAPIView.as_view()),
]
