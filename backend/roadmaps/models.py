# roadmaps/models.py
from django.conf import settings
from django.db import models
from common.models import ShareCodeMixin
import uuid

User = settings.AUTH_USER_MODEL


class Roadmap(ShareCodeMixin):
    DIAGRAM_TYPES = (
        ("flowchart", "Flowchart"),
        ("gantt", "Gantt"),
        ("timeline", "Timeline"),
    )
    id = models.UUIDField(
    primary_key=True,
    default=uuid.uuid4,
    editable=False 
    )

    title = models.CharField(max_length=255)
    description = models.TextField()
    markdown = models.TextField()

    diagram_type = models.CharField(
        max_length=20,
        choices=DIAGRAM_TYPES
    )
    diagram_code = models.TextField()

    milestones = models.JSONField(default=list)

    created_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="generated_roadmaps"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    # marks if this is a temporary/generated roadmap
    is_temporary = models.BooleanField(default=True)

    class Meta:
        ordering = ["-created_at"]


class RoadmapUserLink(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="saved_roadmaps"
    )
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    roadmap = models.ForeignKey(
        Roadmap,
        on_delete=models.CASCADE,
        related_name="user_links"
    )

    is_pinned = models.BooleanField(default=False)
    saved_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "roadmap")
        ordering = ["-saved_at"]
