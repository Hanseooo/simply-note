from rest_framework.exceptions import Throttled
from ai.models import AIUsage

class AIQuotaService:
    LIMITS = {
        "summarize": {
            "count": 5,
            "hours": 4,
        }
    }

    @classmethod
    def check_and_consume(cls, *, user, action):
        config = cls.LIMITS.get(action)

        if not config:
            return  # unlimited / not enforced

        used = AIUsage.used_within(
            user=user,
            action=action,
            hours=config["hours"]
        )

        if used >= config["count"]:
            raise Throttled(
                detail=(
                    f"You have reached the limit of "
                    f"{config['count']} {action} requests "
                    f"every {config['hours']} hours."
                )
            )

        AIUsage.objects.create(user=user, action=action)
