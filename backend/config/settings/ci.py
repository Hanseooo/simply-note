from .base import *
import os
import dj_database_url

# -------------------------
# Core CI settings
# -------------------------

DEBUG = True

SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "ci-insecure-secret")

ALLOWED_HOSTS = ["localhost", "127.0.0.1"]

# -------------------------
# Database (GitHub Actions Postgres)
# -------------------------
# DATABASE_URL is injected by GitHub Actions
# Example:
# postgres://postgres:postgres@localhost:5432/test_db

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is not set for CI environment")

DATABASES = {
    "default": dj_database_url.parse(
        DATABASE_URL,
        conn_max_age=0,
    )
}

# -------------------------
# Security (relaxed for CI)
# -------------------------

SECURE_SSL_REDIRECT = False
SESSION_COOKIE_SECURE = False
CSRF_COOKIE_SECURE = False

# -------------------------
# CORS / CSRF (CI-safe)
# -------------------------

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
]

CSRF_TRUSTED_ORIGINS = [
    "http://localhost:5173",
]

CORS_ALLOW_CREDENTIALS = True

# -------------------------
# Password hashing (faster tests)
# -------------------------

PASSWORD_HASHERS = [
    "django.contrib.auth.hashers.MD5PasswordHasher",
]

# -------------------------
# Email (disable in CI)
# -------------------------

EMAIL_BACKEND = "django.core.mail.backends.locmem.EmailBackend"

# -------------------------
# Logging (keep CI output clean)
# -------------------------

LOGGING = {
    "version": 1,
    "disable_existing_loggers": True,
}
