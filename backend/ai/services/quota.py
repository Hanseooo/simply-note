from django.db import transaction
from django.utils import timezone
from datetime import timedelta

from ai.models import AIQuotaBucket
from ai.exceptions import AIQuotaExceeded
from ai.constants import DEFAULT_QUOTAS

class AIQuotaService:

    @staticmethod
    def ensure_all_buckets(user):
        for bucket, config in DEFAULT_QUOTAS.items():
            AIQuotaBucket.objects.get_or_create(
                user=user,
                bucket=bucket,
                defaults=config,
            )

    @staticmethod
    @transaction.atomic
    def consume(*, user, bucket, cost):
        quota, created = AIQuotaBucket.objects.select_for_update().get_or_create(
            user=user,
            bucket=bucket,
            defaults=DEFAULT_QUOTAS[bucket],
        )

        now = timezone.now()
        window_end = quota.window_started_at + timedelta(hours=quota.window_hours)

        if now >= window_end:
            quota.window_started_at = now
            quota.used_credits = 0

        if quota.used_credits + cost > quota.max_credits:
            retry_after = int((window_end - now).total_seconds())
            raise AIQuotaExceeded(
                bucket=bucket,
                retry_after_seconds=max(retry_after, 0),
                remaining_credits=quota.max_credits - quota.used_credits,
            )

        quota.used_credits += cost
        quota.save(update_fields=[
            "used_credits",
            "window_started_at",
            "updated_at",
        ])

        return {
            "remaining_credits": quota.max_credits - quota.used_credits,
            "window_ends_at": window_end,
        }
