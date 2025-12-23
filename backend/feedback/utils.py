# feedback/utils.py
from datetime import timedelta
from django.utils import timezone
from .models import Feedback

COOLDOWN_MINUTES = 5

def can_submit_feedback(user):
    if not user:
        return True

    last_feedback = (
        Feedback.objects
        .filter(user=user)
        .order_by("-created_at")
        .first()
    )

    if not last_feedback:
        return True

    return timezone.now() >= last_feedback.created_at + timedelta(minutes=COOLDOWN_MINUTES)
