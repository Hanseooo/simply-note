from django.conf import settings
from django.db import models

class Feedback(models.Model):
    FEEDBACK_TYPES = (
        ("rating", "Rating"),
        ("bug", "Bug"),
        ("suggestion", "Suggestion"),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
    )
    is_anonymous = models.BooleanField(default=False)

    feedback_type = models.CharField(max_length=20, choices=FEEDBACK_TYPES)
    rating = models.PositiveSmallIntegerField(null=True, blank=True)
    message = models.TextField(blank=True)
    context = models.CharField(max_length=100, blank=True)

    created_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=["feedback_type"]),
            models.Index(fields=["user", "feedback_type"]),
        ]
