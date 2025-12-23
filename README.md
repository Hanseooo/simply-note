# 📚 SimplyNote

![License](https://img.shields.io/badge/license-CC%20BY--NC%204.0-blue.svg)
![Status](https://img.shields.io/badge/status-production--ready-brightgreen)
![Frontend](https://img.shields.io/badge/frontend-React%20%7C%20Vite-blueviolet)
![Backend](https://img.shields.io/badge/backend-Django%20%7C%20DRF-blueviolet)
![Database](https://img.shields.io/badge/database-PostgreSQL%20(Neon)-blueviolet)
![Hosting](https://img.shields.io/badge/hosting-Vercel%20%2B%20Render-blueviolet)

**SimplyNote** is an **AI-powered learning productivity platform** that helps students and self-learners study smarter using their *own content*.

It transforms raw notes into:
- concise structured summaries,
- structured learning roadmaps,
- interactive quizzes with explanations

> **Status:** ✅ Production-ready  
> Includes authentication, AI usage limits, feedback system, and cloud deployment.

---

## 🚀 What SimplyNote Does

### Core workflow

> **Notes → Summaries → Quizzes**

Everything is generated strictly from **user-provided content** — not generic question banks or pre-made datasets.

### Key Capabilities
- 📝 Summarize pasted notes or PDFs
- 🗺️ Generate AI-powered learning roadmaps
- ❓ Create quizzes *only* from your notes
- 📊 Topic-level quiz mastery & explanations
- 💾 Saved history per user
- 🔗 Share generated content via share codes

---

## ✨ Features

- 🔐 JWT-based authentication
- 📄 PDF upload & parsing
- 🤖 AI-powered summarization, roadmap & quiz generation
- ❓ Quiz explanations and mastery analytics
- ⏱️ Transparent AI quota system
- 📨 Feedback & bug reporting system
- ☁️ Fully cloud-hosted, serverless-friendly backend

---

## 🧠 AI Quota System

SimplyNote implements a **rolling-window AI quota system** to ensure fairness, performance, and transparency.

### How it works
- Each AI action consumes credits from a quota bucket
- Quotas reset after a fixed time window (e.g. 4 hours)
- Different AI actions have different costs:
  - Quiz generation → higher cost
  - Summaries / roadmaps → lower cost

### Design principles
- Rolling windows (no cron jobs)
- Serverless-friendly (computed per request)
- Consistent API across AI endpoints
- Proactive UX with remaining credits and reset countdown
- Future-proof for paid tiers or new AI features

This system:
- Prevents abuse
- Protects backend performance
- Keeps the platform transparent and scalable

---

## 🧱 Tech Stack

### Frontend
- React (function components)
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- TanStack Router & React Query
- Framer Motion
- Lucide Icons
- Sonner (toast notifications)
- Hosted on **Vercel**

### Backend
- Django
- Django REST Framework
- JWT Authentication
- Whitenoise (static files)
- Hosted on **Render**

### Database
- PostgreSQL (Neon)

### Additional Services
- Brevo (email delivery)

---


## 🔐 Authentication

SimplyNote uses a **JWT-based authentication system** implemented with Django and Django REST Framework.

- Short-lived **access tokens**
- **Refresh tokens** for session continuity
- Secure frontend state synchronization
- Authentication logic fully handled by Django

This approach keeps the backend stateless, secure, and serverless-friendly.

---

## 🎯 Design Philosophy

SimplyNote is built around **clarity, trust, and effective learning**.

### Core principles
- **Content-first learning**
- **No generic quizzes**
- **Clear AI usage limits**
- **Minimal and focused UI**
- **Trust & transparency by design**

### SimplyNote helps users:
- Understand concepts deeply
- Study efficiently
- Avoid AI hallucinations
- Learn strictly from their own materials

---

## 📄 Documentation

- 📦 **Deployment guide:** [deployment.md](./DEPLOYMENT.md)
- ⚖️ **License:** [CC BY-NC 4.0](./LICENSE.md)


---

<div align="center">
  <img src="https://media1.tenor.com/m/L-NGu6-CNjEAAAAd/max-verstappen-simply-lovely.gif" width="450" alt="Max Verstappen Simply Lovely">
</div>

