from django.urls import path
from .views import FeedbackView, MyRatingView

urlpatterns = [
    path("", FeedbackView.as_view()),
    path("my-rating/", MyRatingView.as_view())
]