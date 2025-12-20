import json
from ai.services.gemini_client import generate_json_content
from .roadmap_prompts import SYSTEM_PROMPT, build_user_prompt



EXPECTED_HEADERS = {
    "flowchart": "flowchart td",
    "gantt": "gantt",
    "timeline": "timeline",
}

def validate_relative_time(diagram: dict):
    code = diagram.get("code", "").lower()
    forbidden_tokens = ["202", "-", "/"]

    if diagram["type"] in {"gantt", "timeline"}:
        if any(token in code for token in forbidden_tokens):
            raise RoadmapGenerationError("Absolute dates are not allowed")


class RoadmapGenerationError(Exception):
    pass


def generate_roadmap(*, topic: str, diagram_type: str) -> dict:
    raw = generate_json_content(
        system_prompt=SYSTEM_PROMPT,
        user_prompt=build_user_prompt(
            topic=topic,
            diagram_type=diagram_type,
        ),
        thinking_budget=2048,
    )

    try:
        data = json.loads(raw)
    except json.JSONDecodeError:
        raise RoadmapGenerationError("Invalid JSON returned by AI")

    # Minimal validation (fail fast)
    required_keys = {"title", "description", "markdown", "diagram"}
    if not required_keys.issubset(data):
        raise RoadmapGenerationError("Missing required fields")

    diagram = data.get("diagram", {})
    if diagram.get("type") != diagram_type:
        raise RoadmapGenerationError("Diagram type mismatch")
    
    validate_relative_time(diagram)

    header = diagram["code"].strip().split("\n")[0].lower()
    if not header.startswith(EXPECTED_HEADERS[diagram_type]):
        raise RoadmapGenerationError("Invalid Mermaid diagram header")

    return data
