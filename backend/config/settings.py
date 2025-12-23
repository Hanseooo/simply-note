import os

ENV = os.getenv("DJANGO_ENV", "dev")

if ENV == "prod":
    from .settings.prod import *
else:
    from .settings.dev import *
