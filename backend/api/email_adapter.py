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

    def send_password_reset_mail(self, user, email, reset_url):
        send_brevo_email(
            to=email,
            template_id=2,
            params={"RESET_URL": reset_url},
        )
