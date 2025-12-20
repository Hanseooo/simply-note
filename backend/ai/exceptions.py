from rest_framework.exceptions import APIException

class AIQuotaExceeded(APIException):
    status_code = 429
    default_code = "ai_quota_exceeded"

    def __init__(self, *, bucket, retry_after_seconds, remaining_credits):
        self.detail = {
            "code": "AI_QUOTA_EXCEEDED",
            "bucket": bucket,
            "retry_after_seconds": retry_after_seconds,
            "remaining_credits": remaining_credits,
        }
