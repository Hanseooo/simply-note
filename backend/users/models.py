# api/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid
from django.utils import timezone
from django.contrib.auth.hashers import make_password, check_password

class User(AbstractUser):
    email = models.EmailField(unique=True)
    is_email_verified = models.BooleanField(default=False)
    email_verification_code = models.CharField(max_length=128, null=True, blank=True)
    email_verification_key = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    email_verification_code_expires_at = models.DateTimeField(null=True, blank=True)
    email_verification_sent_at = models.DateTimeField(null=True, blank=True)
    email_verification_attempts = models.PositiveIntegerField(default=0)
    REQUIRED_FIELDS = ["email"]
