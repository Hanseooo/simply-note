from ai.services.gemini_client import generate_json_content
from .quiz_prompt import QUIZ_SYSTEM_PROMPT, build_quiz_user_prompt

def generate_quiz_ai(*, summary, options):
    user_prompt = build_quiz_user_prompt(
        summary_markdown=summary.markdown,
        key_points=summary.key_points,
        options=options,
    )

    raw_json = generate_json_content(
        system_prompt=QUIZ_SYSTEM_PROMPT,
        user_prompt=user_prompt,
        thinking_budget=2048,
        model="gemini-2.5-flash",
    )

    return raw_json
