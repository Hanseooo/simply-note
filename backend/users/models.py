# api/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid
from django.utils import timezone
from django.contrib.auth.hashers import make_password, check_password
from django.conf import settings

class User(AbstractUser):
    email = models.EmailField(unique=True)
    is_email_verified = models.BooleanField(default=False)
    email_verification_code = models.CharField(max_length=128, null=True, blank=True)
    email_verification_key = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    email_verification_code_expires_at = models.DateTimeField(null=True, blank=True)
    email_verification_sent_at = models.DateTimeField(null=True, blank=True)
    email_verification_attempts = models.PositiveIntegerField(default=0)
    pending_email = models.EmailField(null=True, blank=True)
    pending_email_code = models.CharField(max_length=128, null=True, blank=True)
    pending_email_expires_at = models.DateTimeField(null=True, blank=True)
    pending_email_attempts = models.PositiveIntegerField(default=0)
    REQUIRED_FIELDS = ["email"]



class PasswordResetToken(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="password_reset_tokens",
    )
    token = models.UUIDField(default=uuid.uuid4, unique=True)
    expires_at = models.DateTimeField()
    used_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["token"]),
        ]

    def is_valid(self):
        return (
            self.used_at is None and
            timezone.now() < self.expires_at
        )

