import os
from google import genai
from google.genai import types

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

def generate_json_content(
    *,
    system_prompt: str,
    user_prompt: str,
    thinking_budget: int = -1,
):
    response = client.models.generate_content(
        model="gemini-2.5-flash",
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
