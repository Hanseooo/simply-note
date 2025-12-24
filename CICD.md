# Full-Stack CI/CD Documentation

This document explains the **GitHub Actions CI/CD workflow** for the monorepo project consisting of:

- **Frontend:** Vite + React + TanStack Router (deployed on Vercel)
- **Backend:** Django REST Framework + PostgreSQL (tested in CI, deployed separately)

---

## Workflow Overview

The CI/CD workflow is defined in:

```
.github/workflows/main.yml
```

It runs on:

- **Push** to `main`
- **Pull requests** targeting `main`

The workflow contains **two jobs**:

1. **Frontend** – build & deploy to Vercel
2. **Backend** – run Django migrations and tests

The backend job runs **after** the frontend job using:

```yaml
needs: frontend
```

---

## Frontend Job (Vercel)

### Responsibilities
- Install dependencies
- Prebuild TanStack Route Tree
- Build the production bundle
- Deploy to Vercel using the CLI

### Key Steps

- Node version: **20**
- Working directory: `./frontend`
- Build output: `dist`
- Deployment command:
```bash
npx vercel deploy --prod --yes
```

### Required Secret

| Name | Description |
|----|------------|
| `VERCEL_TOKEN` | Personal Vercel token with project scope |

Telemetry is disabled in CI using:
```bash
VERCEL_TELEMETRY=0
```

---

## Backend Job (Django)

### PostgreSQL Service

The backend job spins up a PostgreSQL **17** service container:

```yaml
services:
  postgres:
    image: postgres:17
    env:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: test_db
```

This database is only used for **CI testing**.

---

### Backend Steps

- Python version: **3.12**
- Working directory: `./backend`

Steps executed:

1. Install dependencies
2. Run migrations
3. Run test suite

Commands:
```bash
python manage.py migrate --settings=config.settings.ci
python manage.py test --settings=config.settings.ci
```

---

## Django Settings Structure

The project uses **environment-based settings loading**.

### `config/settings/__init__.py`
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

---

### CI Settings

**`config/settings/ci.py`**
```python
from .base import *

DEBUG = True

AI_ENABLED = False

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

### Why AI is Disabled in CI

- CI does **not** have access to Gemini API keys
- Django imports all URLs during migrations/tests
- AI clients are initialized lazily and guarded by `AI_ENABLED`

This prevents CI failures caused by missing external services.

---

### Dev / Prod Settings

```python
AI_ENABLED = True
```

- Gemini is enabled only in real environments
- API keys are provided via environment variables

---

## AI Architecture (Important)

- Gemini client initialization lives **only** in `gemini_client.py`
- Views never import or initialize AI clients directly
- When `AI_ENABLED = False`, AI calls raise a controlled exception

This design ensures:
- CI stability
- Clean separation of concerns
- No import-time side effects

---

## Environment Variables

### CI
| Variable | Purpose |
|-------|--------|
| `DJANGO_ENV=ci` | Loads CI settings |
| `DATABASE_URL` | PostgreSQL connection (optional) |

### Dev / Prod
| Variable | Purpose |
|-------|--------|
| `GEMINI_API_KEY` | Google Gemini API key |
| `DJANGO_ENV` | `dev` or `prod` |

---

## Branch & PR Behavior

- Workflow **runs on PRs targeting `main`**
- GitHub always executes the workflow file **from the PR source branch**
- Merging `develop → main` runs CI using the workflow defined in `develop`

---

## Best Practices

- Never initialize external services at import time
- Keep CI deterministic and isolated
- Guard optional integrations with feature flags
- Use service containers for databases
- Keep workflows in version control per branch

---

## References

- GitHub Actions: https://docs.github.com/en/actions
- Django Testing: https://docs.djangoproject.com/en/stable/topics/testing/
- Vercel CLI: https://vercel.com/docs/cli
- PostgreSQL Docker Image: https://hub.docker.com/_/postgres
