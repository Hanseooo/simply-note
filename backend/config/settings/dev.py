from .base import *

DEBUG = True

AI_ENABLED = True


ALLOWED_HOSTS = []

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:5173",
]

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "simply_note_db",
        "USER": "postgres",
        "PASSWORD": "qwerty1234",
        "HOST": "localhost",
        "PORT": "5432",
    }
}
