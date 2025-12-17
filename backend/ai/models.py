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
