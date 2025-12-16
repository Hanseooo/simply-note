from django.urls import path
from .views import VerifyEmailView, ResendVerificationCodeView, CustomRegisterView, LoginAPIView

urlpatterns = [
    path("verify-email/", VerifyEmailView.as_view(), name="verify-email"),
    path(
        "auth/registration/resend-verification/",
        ResendVerificationCodeView.as_view(),
        name="resend-verification",
    ),
    path("register/", CustomRegisterView.as_view(), name="custom-register"),
    path('login/', LoginAPIView.as_view(), name='custom-login'),
]
