from django.urls import path
from .views import SummarizeNotesAPIView, AIQuotaStatusAPIView

urlpatterns = [
    path("summarize/", SummarizeNotesAPIView.as_view()),
    path("quota/", AIQuotaStatusAPIView.as_view())
]
