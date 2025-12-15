# 📚 SimplyNote (WIP)

An **AI-powered study tool** that helps learners understand topics faster by:
- summarizing pasted notes or PDFs,
- generating a structured learning roadmap,
- and creating quizzes to test understanding.

Built as a **cost-efficient SaaS MVP** using a modern frontend, a serverless backend, and managed cloud services.

> 🚧 **Status:** Work in progress (active development)

---

## ✨ Features

- 🔐 User authentication (JWT-based)
- 📝 Text-based note summarization
- 📄 PDF upload & summarization
- 🗺️ AI-generated learning roadmaps
- ❓ Automatic quiz generation
- 💾 Saved history per user
- ☁️ Serverless backend (pay-per-request)

---

## 🧱 Tech Stack

### Frontend
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- Tanstack Router & Query
- Vercel (hosting)

### Backend
- Django
- Django REST Framework
- JWT Authentication
- AWS Lambda (serverless)
- API Gateway

### Database
- PostgreSQL (Neon / Supabase)

### Cloud & Infrastructure
- AWS Lambda
- AWS API Gateway
- AWS S3 (store pdf)
- AWS Secrets Manager
- CloudWatch (logging)

---
```

Frontend (Vercel)
React + Tailwind + shadcn/ui + Tanstack Query
|
| HTTPS
↓
API Gateway
↓
AWS Lambda (Django + DRF)
|
↓
PostgreSQL (Neon / Supabase)

Additional Services:

S3 → user saved pdf for easy access

Secrets Manager → API keys & secrets
```

---

## 🔐 Authentication

- JWT-based authentication
- Short-lived access tokens
- Refresh tokens for session continuity
- Auth logic handled entirely in Django

---

## 💡 Why Serverless?

This project is designed as a **low-cost SaaS MVP**:
- No paying for idle backend servers
- Scales automatically with usage
- Ideal for low traffic and early-stage products

---

<div align="center">
  <img src="https://media1.tenor.com/m/L-NGu6-CNjEAAAAd/max-verstappen-simply-lovely.gif" width="450" alt="Max Verstappen Simply Lovely">
</div>


