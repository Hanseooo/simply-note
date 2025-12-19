import uuid
from django.db import models
from django.conf import settings

class Quiz(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    summary = models.ForeignKey("summaries.Summary", on_delete=models.CASCADE)
    generated_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    difficulty = models.CharField(max_length=32)
    options = models.JSONField()
    content = models.JSONField()
    topics = models.JSONField()
    share_code = models.CharField(max_length=16, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)


class QuizUser(models.Model):
    quiz = models.ForeignKey(
        Quiz,
        on_delete=models.CASCADE,
        related_name="linked_users",
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )
    is_pinned = models.BooleanField(default=False)
    linked_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("quiz", "user")


