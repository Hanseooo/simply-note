from django.conf import settings
from django.db import models
from django.utils import timezone
from datetime import timedelta

User = settings.AUTH_USER_MODEL

class AIUsage(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    action = models.CharField(max_length=50)  # "summarize", future: "rewrite", "chat"
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["user", "action", "created_at"]),
        ]

    @staticmethod
    def used_within(user, action, hours):
        since = timezone.now() - timedelta(hours=hours)
        return AIUsage.objects.filter(
            user=user,
            action=action,
            created_at__gte=since
        ).count()


class AIQuotaBucket(models.Model):
    BUCKET_GENERAL = "general"
    BUCKET_QUIZ = "quiz"

    BUCKET_CHOICES = [
        (BUCKET_GENERAL, "General AI"),
        (BUCKET_QUIZ, "Quiz AI"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="ai_quotas",
    )

    bucket = models.CharField(
        max_length=32,
        choices=BUCKET_CHOICES,
    )

    window_started_at = models.DateTimeField(default=timezone.now)
    used_credits = models.PositiveIntegerField(default=0)

    max_credits = models.PositiveIntegerField()
    window_hours = models.PositiveSmallIntegerField(default=4)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("user", "bucket")
        indexes = [
            models.Index(fields=["user", "bucket"]),
        ]
