import os

ENV = os.getenv("DJANGO_ENV", "dev")

if ENV == "prod":
    from .settings.prod import *
    
elif ENV == "ci":
    from .settings.ci import *

else:
    from .settings.dev import *
