# ai/constants.py
from enum import IntEnum

class AICreditCost(IntEnum):
    # GENERAL bucket
    SUMMARIZE_FLASH_LITE = 1
    ROADMAP_FLASH_LITE = 1

    # if i add paid tiers lol
    # SUMMARIZE_FLASH = 2
    # ROADMAP_FLASH = 2

    # QUIZ bucket
    QUIZ_GENERATION = 2 


DEFAULT_QUOTAS = {
    "general": {
        "max_credits": 6,   
        "window_hours": 4,
    },
    "quiz": {
        "max_credits": 6,   
        "window_hours": 4,
    },
}
