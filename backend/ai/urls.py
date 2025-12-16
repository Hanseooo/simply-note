from django.urls import path
from .views import SummarizeNotesAPIView

urlpatterns = [
    path("summarize/", SummarizeNotesAPIView.as_view()),
]
