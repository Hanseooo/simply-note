from django.db.models.signals import post_delete
from django.dispatch import receiver
from .models import SavedSummary

@receiver(post_delete, sender=SavedSummary)
def delete_summary_if_unused(sender, instance, **kwargs):
    summary = instance.summary
    if not summary.saved_by.exists():
        summary.delete()
