from rest_framework.throttling import UserRateThrottle

class AIGenerationBurstThrottle(UserRateThrottle):
    scope = "ai_generation_burst"

