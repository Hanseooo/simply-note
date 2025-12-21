from django.urls import path
from .views import VerifyEmailView, ResendVerificationCodeView, CustomRegisterView, LoginAPIView, ForgotPasswordView, ResetPasswordView, CheckUsernameView, ChangeEmailConfirmView, ChangeEmailRequestView, ChangeUsernameView, ChangePasswordView

urlpatterns = [
    path("verify-email/", VerifyEmailView.as_view(), name="verify-email"),
    path(
        "auth/registration/resend-verification/",
        ResendVerificationCodeView.as_view(),
        name="resend-verification",
    ),
    path("register/", CustomRegisterView.as_view(), name="custom-register"),
    path('login/', LoginAPIView.as_view(), name='custom-login'),
    path("forgot-password/", ForgotPasswordView.as_view()),
    path("reset-password/", ResetPasswordView.as_view()),
    path("check-username/", CheckUsernameView.as_view()),
    path("change-username/", ChangeUsernameView.as_view()),
    path("change-email/request/", ChangeEmailRequestView.as_view()),
    path("change-email/confirm/", ChangeEmailConfirmView.as_view()),
     path("change-password/", ChangePasswordView.as_view()),
]
