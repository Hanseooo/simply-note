from django.conf import settings
from google.genai import types

_client = None


def get_client():
    global _client

    if not settings.AI_ENABLED:
        return None

    if _client is None:
        from google import genai

        _client = genai.Client(
            api_key=settings.GEMINI_API_KEY
        )

    return _client


def generate_json_content(
    *,
    system_prompt: str,
    user_prompt: str,
    thinking_budget: int = -1,
    model: str = "gemini-2.5-flash-lite",
):
    client = get_client()

    if client is None:
        raise RuntimeError("AI features are disabled in this environment")

    response = client.models.generate_content(
        model=model,
        contents=user_prompt,
        config=types.GenerateContentConfig(
            system_instruction=system_prompt,
            thinking_config=types.ThinkingConfig(
                thinking_budget=thinking_budget
            ),
            response_mime_type="application/json",
        ),
    )

    return response.text
