# Full-Stack CI/CD Documentation

This document explains the **GitHub Actions CI/CD workflow** for the monorepo project consisting of:

- **Frontend:** Vite + React + TanStack Router (hosted on Vercel)
- **Backend:** Django REST Framework with PostgreSQL (hosted on Render)

---

## Workflow Overview

The CI/CD workflow is defined in `.github/workflows/main.yml` and is triggered on:

- **Push** to `main` branch
- **Pull requests** targeting `main`

The workflow consists of **two jobs**:

1. **Frontend:** Build & deploy to Vercel
2. **Backend:** Run Django migrations and tests

The backend job **depends on the frontend job** (`needs: frontend`).

---

## Frontend Job

### Steps

1. **Checkout Code**
```yaml
uses: actions/checkout@v4
```

2. **Setup Node.js**
```yaml
uses: actions/setup-node@v3
with:
  node-version: '20'
```

3. **Install Dependencies**
```yaml
run: npm install
working-directory: ./frontend
```

4. **Prebuild RouteGenTree**
```yaml
run: npm run prebuild
working-directory: ./frontend
```

5. **Build Frontend**
```yaml
run: npm run build
working-directory: ./frontend
```

6. **Deploy to Vercel**
```yaml
run: npx vercel deploy --prod --token $VERCEL_TOKEN --yes
env:
  VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
  VERCEL_TELEMETRY: 0
working-directory: ./frontend
```
- Automatically detects project settings
- Output directory: `dist`
- CLI telemetry disabled for CI

---

## Backend Job

### Services

- **PostgreSQL 17** container for CI
```yaml
services:
  postgres:
    image: postgres:17
    env:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: test_db
    ports:
      - 5432:5432
    options: >-
      --health-cmd "pg_isready -U postgres"
      --health-interval 10s
      --health-timeout 5s
      --health-retries 5
```

### Steps

1. **Checkout Code**
```yaml
uses: actions/checkout@v4
```

2. **Setup Python**
```yaml
uses: actions/setup-python@v4
with:
  python-version: '3.12'
```

3. **Install Dependencies**
```yaml
run: |
  pip install --upgrade pip
  pip install -r requirements.txt
working-directory: ./backend
```

4. **Run Django Migrations**
```yaml
run: python manage.py migrate
env:
  DJANGO_ENV: ci
  DATABASE_URL: postgres://postgres:postgres@localhost:5432/test_db
working-directory: ./backend
```

5. **Run Django Tests**
```yaml
run: python manage.py test
env:
  DJANGO_ENV: ci
  DATABASE_URL: postgres://postgres:postgres@localhost:5432/test_db
working-directory: ./backend
```

---

## Django Settings for CI

**`config/settings/ci.py`**
```python
from .base import *

DEBUG = True

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": "test_db",
        "USER": "postgres",
        "PASSWORD": "postgres",
        "HOST": "localhost",
        "PORT": 5432,
    }
}
```

**`config/settings/settings.py`**
```python
import os
ENV = os.getenv("DJANGO_ENV", "dev")

if ENV == "prod":
    from .prod import *
elif ENV == "ci":
    from .ci import *
else:
    from .dev import *
```

- Ensures CI uses local PostgreSQL container
- `DJANGO_ENV=ci` in workflow points to `ci.py`

---

## Environment Variables / Secrets

### Frontend
- `VERCEL_TOKEN` → Personal Vercel token with project-level scope

### Backend (optional Render deployment)
- `RENDER_API_KEY` → Render API key if deploying backend automatically

### Django CI
- `DJANGO_ENV=ci` → Loads CI-specific settings
- `DATABASE_URL` → PostgreSQL URL for testing

---

## Notes / Best Practices

1. **Monorepo paths:**
   - Frontend: `./frontend`
   - Backend: `./backend`

2. **Caching (optional)**
   - Node modules: `./frontend/node_modules`
   - Pip cache: `~/.cache/pip`

3. **Order of Jobs:**
   - Frontend must complete before backend runs migrations/tests

4. **Vercel CLI:**
   - Use `--yes` instead of deprecated `--confirm`
   - Disable telemetry with `VERCEL_TELEMETRY=0`

5. **PostgreSQL Version:**
   - CI uses PostgreSQL 17 to match production
   - Compatible with Django migrations and tests

---

## References

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Vercel CLI Docs](https://vercel.com/docs/cli)
- [Django Testing Docs](https://docs.djangoproject.com/en/6.0/topics/testing/)
- [PostgreSQL Docker Image](https://hub.docker.com/_/postgres)

