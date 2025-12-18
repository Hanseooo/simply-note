# roadmaps/signals.py
from django.db.models.signals import post_delete
from django.dispatch import receiver
from .models import RoadmapUserLink, Roadmap

@receiver(post_delete, sender=RoadmapUserLink)
def cleanup_orphan_roadmaps(sender, instance, **kwargs):
    roadmap = instance.roadmap
    if not roadmap.user_links.exists():
        roadmap.delete()
