# Viotel Installation Dashboard

Full-stack web application for managing tower sensor installations. Field engineers submit installation records with photos, videos, and technical data. Operations teams review and confirm them.

## Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS 4, React Router
- **Backend:** Python, FastAPI, SQLAlchemy (async), PostgreSQL
- **Storage:** S3-compatible or local filesystem
- **Auth:** JWT + bcrypt
- **Deploy:** Railway (Docker)

## Setup

### Prerequisites

- Node.js 18+
- Python 3.11+
- PostgreSQL 14+

### Frontend

```bash
npm install
cp .env.example .env
npm run dev
```

### Backend

```bash
cd server
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload --port 8080
```

Tables are created automatically on first startup.

## Environment Variables

### Frontend `.env`

```
VITE_API_URL=http://localhost:8080
```

### Backend `server/.env`

```
DATABASE_URL=postgresql://user:pass@localhost:5432/viotel
JWT_SECRET=your-secret-key
JWT_EXPIRE_MINUTES=1440
USE_LOCAL_STORAGE=true

# S3 (optional, if not using local storage)
S3_ENDPOINT=https://...
S3_BUCKET=bucket-name
S3_ACCESS_KEY=key
S3_SECRET_KEY=secret
S3_REGION=us-east-1
```

`DATABASE_URL` and `JWT_SECRET` are required. Everything else is optional.

## Project Structure

```
dashboard/
├── src/
│   ├── components/          # Reusable UI components
│   ├── context/             # Auth, Toast, Notifications providers
│   ├── pages/               # Route pages
│   ├── api.js               # API client
│   ├── App.jsx              # Root with routing
│   └── main.jsx             # Entry point
├── server/
│   ├── routers/
│   │   ├── auth_router.py
│   │   ├── installations_router.py
│   │   └── media_router.py
│   ├── main.py              # FastAPI app, middleware, lifespan
│   ├── config.py            # Env-based settings
│   ├── database.py          # Async engine & session
│   ├── models.py            # ORM models
│   ├── schemas.py           # Pydantic schemas
│   ├── auth.py              # JWT & password hashing
│   ├── storage.py           # S3 / local file storage
│   ├── Dockerfile
│   └── requirements.txt
├── package.json
├── railway.json
└── index.html
```

## Run Commands

```bash
# Frontend
npm run dev          # Dev server
npm run build        # Production build
npm run preview      # Preview build
npm run lint         # ESLint
npm run start        # Serve production build

# Backend (from server/)
uvicorn main:app --reload --port 8080
```

## Deployment

Configured for Railway:

- **Backend** — Docker build from `server/`
- **Frontend** — Static build served with `serve`
- **Database** — Railway PostgreSQL plugin
- **Storage** — Railway Object Storage (S3-compatible)

Set environment variables in Railway dashboard. Don't commit `.env` files.

### Docker (manual)

```bash
cd server
docker build -t viotel-api .
docker run -p 8080:8080 --env-file .env viotel-api
```

## Security

- All endpoints except `/api/auth/login` and `/api/health` require JWT Bearer token
- Passwords hashed with bcrypt
- File uploads validated by type and size (20MB images, 500MB videos)
- Media access scoped per company
- Restrict CORS origins in production
- Generate JWT secret: `openssl rand -hex 32`
- Never commit `.env` files
