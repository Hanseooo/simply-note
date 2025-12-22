from django.urls import path, include


urlpatterns = [
    path('auth/', include('dj_rest_auth.urls')),
    path('users/', include('users.urls')),
    path('ai/', include('ai.urls')),
    path('summaries/', include('summaries.urls')),
    path('roadmaps/', include('roadmaps.urls')),
    path('quizzes/', include('quizzes.urls')),
    path('feedback/', include('feedback.urls'))
]
