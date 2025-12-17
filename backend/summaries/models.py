import uuid
import random
import string
from django.conf import settings
from django.db import models
from django.db.models import Count
from django.contrib.postgres.fields import ArrayField


def generate_share_code(length=8):
    return ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))


class Summary(models.Model):
    # Public identity
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    share_code = models.CharField(
        max_length=8,
        unique=True,
        db_index=True,
        default=generate_share_code
    )

    # Ownership
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="created_summaries"
    )

    # Content (matches your TS type)
    title = models.CharField(max_length=255)
    description = models.TextField()
    markdown = models.TextField()
    key_points = ArrayField(models.TextField(), default=list)
    topics = ArrayField(models.CharField(max_length=64), default=list)

    difficulty = models.CharField(
        max_length=16,
        choices=[
            ("beginner", "Beginner"),
            ("intermediate", "Intermediate"),
            ("advanced", "Advanced"),
        ]
    )

    word_count = models.PositiveIntegerField()

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=["share_code"]),
        ]

    def __str__(self):
        return f"{self.title} ({self.share_code})"


class SavedSummary(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="saved_summaries"
    )
    summary = models.ForeignKey(
        Summary,
        on_delete=models.CASCADE,
        related_name="saved_by"
    )

    is_pinned = models.BooleanField(default=False)
    saved_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "summary")

    def __str__(self):
        return f"{self.user} → {self.summary}"
