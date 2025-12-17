from rest_framework.throttling import UserRateThrottle

class AISummarizeBurstThrottle(UserRateThrottle):
    scope = "ai_summarize_burst"
