# SimplyNote AI – System Deployment Documentation

## Table of Contents

1. [Project Overview](#project-overview)  
2. [Tech Stack](#tech-stack)  
3. [Branch Strategy](#branch-strategy)  
4. [Environment Variables](#environment-variables)  
5. [Django Settings Structure](#django-settings-structure)  
6. [Database Setup (Neon)](#database-setup-neon)  
7. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)  
8. [Backend Deployment (Render)](#backend-deployment-render)  
9. [Gunicorn & Static Files](#gunicorn--static-files)  
10. [Common Issues & Tips](#common-issues--tips)  
11. [Scaling Considerations](#scaling-considerations)  
12. [Commands Reference](#commands-reference)  

---

## Project Overview

SimplyNote is an **AI-powered full-stack web application** with a Django backend and a React/TypeScript frontend. It allows users to log in, generate summaries for their notes, generate quizzes based on notes, and generate comprehensive topic roadmaps The system is deployed with a **production-ready architecture** using modern tools and services:

- **Backend:** Django REST API  
- **Frontend:** Vite + React + Tailwind + Tanstack React Router and Query  
- **Database:** Neon (PostgreSQL)  
- **Hosting:** Render (backend) + Vercel (frontend)  
- **Email Service:** Brevo API  
- **Authentication:** JWT via `rest_framework_simplejwt`  

---

## Tech Stack

| Layer             | Technology                                      | Purpose                                           |
|------------------|-------------------------------------------------|-------------------------------------------------|
| Frontend          | React + Vite + Tailwind                         | User interface and client-side routing         |
| Backend           | Django 6 + DRF + SimpleJWT                      | REST API, authentication, business logic       |
| Database          | Neon (PostgreSQL)                               | Persistent storage                               |
| Hosting           | Render (backend)                                | Production deployment of Django                |
| Hosting           | Vercel (frontend)                               | Production deployment of React                  |
| Email Provider    | Brevo API                                       | Send email confirmations and notifications     |
| CORS & CSRF       | django-cors-headers                             | Secure cross-origin requests                   |
| Static Files      | WhiteNoise                                      | Serve static files on Render                    |

---

## Branch Strategy

To separate **development** from **production**:

1. **`main`**: Production-ready branch. Deployed on Render/Vercel.  
2. **`develop`**: Development branch, local testing.  
3. Optional **feature branches**: For working on new features, merged into `develop`.  

---

## Environment Variables

**Backend (`Render`)**

| Variable                  | Purpose                                               | Example                                     |
|----------------------------|------------------------------------------------------|---------------------------------------------|
| `DJANGO_SECRET_KEY`        | Django production secret key                         | `django-123abc!`                             |
| `DJANGO_SETTINGS_MODULE`   | Settings module to use                               | `config.settings.prod`                       |
| `DATABASE_URL`             | Neon PostgreSQL connection string                    | `postgresql://user:pass@host:5432/db`       |
| `FRONTEND_BASE_URL`        | React frontend URL for CORS/CSRF                     | `https://simplynote-ai.vercel.app`          |
| `DEFAULT_FROM_EMAIL`       | Email sender for notifications                       | `hanseo@email.com`                  |
| `BREVO_API_KEY`            | API key for Brevo email service                      | `xkey12345`                                  |

**Frontend (`Vercel`)**

| Variable               | Purpose                     | Example                                    |
|------------------------|----------------------------|--------------------------------------------|
| `VITE_API_BASE_URL`    | Backend API endpoint        | `https://simplynote-backend.com`  |

> **Important:** Do **not** include paths in `FRONTEND_BASE_URL` (no trailing slash). Example: `https://simplynote-ai.vercel.app`

---

## Django Settings Structure

- **`settings/base.py`** – Common settings used in both dev and prod.  
- **`settings/dev.py`** – Development overrides (DEBUG=True, local DB).  
- **`settings/prod.py`** – Production overrides (DEBUG=False, Neon DB, HTTPS, WhiteNoise for static files).  

**Prod Settings Highlights:**

```python
DEBUG = False
ALLOWED_HOSTS = [os.getenv("RENDER_EXTERNAL_HOSTNAME")]
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
CORS_ALLOWED_ORIGINS = [os.getenv("FRONTEND_BASE_URL")]
DATABASES = dj_database_url.config(conn_max_age=600, ssl_require=True)
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"
```

---

## Database Setup (Neon)

1. Create a new project in **Neon**.  
2. Copy the **connection string** → `DATABASE_URL` in `.env`.  
3. Run migrations on Render:

```bash
python manage.py migrate --settings=config.settings.prod
```

4. Optionally, create a **backup** from development DB if needed.  

> No need to migrate local tables manually if you are deploying a fresh database.

---

## Frontend Deployment (Vercel)

1. Connect your GitHub repository to Vercel.  
2. Add environment variable:

```
VITE_API_BASE_URL=https://your-backend.onrender.com
```

3. Build command:

```
npm run build
```

4. Output directory:

```
dist
```

5. Automatic deployments will trigger when you push to `main`.

---

## Backend Deployment (Render)

1. Create a **Web Service** in Render.  
2. Set **Environment** to Python 3.11.  
3. Add **Environment Variables** (from `.env`).  
4. Build command:

```bash
pip install -r requirements.txt
python manage.py collectstatic --noinput --settings=config.settings.prod
python manage.py migrate --settings=config.settings.prod
```

5. Start command:

```bash
gunicorn config.wsgi:application
```

---

## Gunicorn & Static Files

- **Gunicorn** is the WSGI server that runs Django in production.  
- **WhiteNoise** serves static files efficiently without Nginx.  
- **Collectstatic** gathers all static files into `STATIC_ROOT` (`staticfiles/`) so they are ready for production.

```bash
python manage.py collectstatic --settings=config.settings.prod
```

> Always run `collectstatic` before deploying updates with static assets.

---

## Common Issues & Tips

- **CORS errors** → Remove trailing slash from `FRONTEND_BASE_URL`.  
- **Missing `whitenoise`** → Install: `pip install whitenoise`.  
- **Database connection fails** → Make sure `DATABASE_URL` is correct and SSL is enabled.  
- **Static files not showing** → Ensure `STATIC_ROOT` is set and `collectstatic` ran.  
- **Gunicorn errors** → Check WSGI module path: `config.wsgi:application`.  

---

## Scaling Considerations

- **Postgres (Neon):** Use connection pooling for high traffic.  
- **Render:** Consider upgrading service plan for more CPU/memory.  
- **Frontend (Vercel):** Can handle serverless scaling automatically.  
- **Caching:** Implement Redis if AI generation requests grow.

---

## Commands Reference

| Command | Purpose |
|---------|---------|
| `python manage.py migrate --settings=config.settings.prod` | Apply DB migrations |
| `python manage.py collectstatic --settings=config.settings.prod` | Collect static files |
| `gunicorn config.wsgi:application` | Run production server |
| `python manage.py runserver --settings=config.settings.dev` | Run local dev server |
| `python manage.py createsuperuser --settings=config.settings.dev` | Create admin account locally |

---

## Repository Management Tips

- **`main`** → Production-ready code only.  
- **`develop`** → Daily development + testing.  
- **Feature branches** → Merge into `develop`.  
- **Deployments** → Always merge `develop` → `main` for production.  
- Keep `.env` files **local** and never commit them to GitHub.  

---

This documentation ensures **deployment is repeatable, safe, and production-ready**.

