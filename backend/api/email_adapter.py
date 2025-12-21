from django.conf import settings
from .utils.brevo import send_brevo_email

class BrevoEmailService:
    def send_confirmation_mail(self, request, user, raw_code: str):
        verify_url = (
            f"{settings.FRONTEND_BASE_URL}/verify-email"
            f"?key={user.email_verification_key}"
        )

        send_brevo_email(
            to=user.email,
            subject="Verify your Simply Note email",
            html_template="verification_email.html",
            text_template="verification_email.txt",
            params={
                "VERIFY_URL": verify_url,
                "VERIFICATION_CODE": raw_code,
                "USERNAME": user.username,
            },
        )

    def send_password_reset_mail(self, user, reset_url):
        send_brevo_email(
            to=user.email,
            subject="Reset your SimplyNote password",
            html_template="password_reset_email.html",
            text_template="password_reset_email.txt",
            params={
                "RESET_URL": reset_url,
                "USERNAME": user.username,
            },
        )

    def send_change_email_code(self, user, raw_code):
        send_brevo_email(
            to=user.pending_email,
            subject="Confirm your new email",
            html_template="change_email_verification.html",
            text_template="change_email_verification.txt",
            params={
                "VERIFICATION_CODE": raw_code,
                "USERNAME": user.username,
            },
        )
