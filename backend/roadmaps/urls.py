from django.urls import path
from .views import GenerateRoadmapAPIView

urlpatterns = [
    path("generate/", GenerateRoadmapAPIView.as_view()),
]
