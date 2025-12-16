import requests
from django.conf import settings
from django.template.loader import render_to_string
from datetime import datetime

BREVO_URL = "https://api.brevo.com/v3/smtp/email"

def send_brevo_email(to, subject=None, template_id=None, params=None, html_template=None, text_template=None):
    """
    Send email via Brevo with optional HTML and plain text versions.
    """
    headers = {
        "accept": "application/json",
        "api-key": settings.BREVO_API_KEY,
        "content-type": "application/json",
    }

    params = params or {}
    params.setdefault("YEAR", datetime.now().year)

    html_content = render_to_string(html_template, params) if html_template else None
    text_content = render_to_string(text_template, params) if text_template else None

    payload = {
        "to": [{"email": to}],
    }

    if template_id:
        payload["templateId"] = template_id
        payload["params"] = params
    elif html_content or text_content:
        payload.update({
            "subject": subject or "No Subject",
            "sender": {"name": "Simply Note", "email": settings.DEFAULT_FROM_EMAIL},
            "htmlContent": html_content or "",
            "textContent": text_content or "",
        })
    else:
        raise ValueError("Must provide either template_id or html_template/text_template")

    response = requests.post(BREVO_URL, json=payload, headers=headers)
    response.raise_for_status()
