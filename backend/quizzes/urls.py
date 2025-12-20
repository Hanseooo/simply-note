from django.urls import path
from .views import (
    PinQuizView,
    UnpinQuizView,
    UnsaveQuizView,
    SavedQuizzesView,
    QuizDetailView,
    GenerateQuizView,
    QuizByCodeView,
)

urlpatterns = [
    path("saved/", SavedQuizzesView.as_view()),
    path("<uuid:quiz_id>/pin/", PinQuizView.as_view()),
    path("<uuid:quiz_id>/unpin/", UnpinQuizView.as_view()),
    path("<uuid:quiz_id>/unsave/", UnsaveQuizView.as_view()),
    path("<uuid:quiz_id>/", QuizDetailView.as_view()),
    path("generate/", GenerateQuizView.as_view()),
    path("share/<str:code>/", QuizByCodeView.as_view())
]
