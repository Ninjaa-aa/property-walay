# Quick Start Guide

## 1. Setup Environment

Create `.env` file in `backend/` directory:

```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SECRET_KEY=sb_secret_oQAd2...
DATABASE_URL=postgresql://postgres:password@your-project-ref.supabase.co:5432/postgres


```

**Where to find these:**
- **Supabase Dashboard** → **Settings** → **API** → **API Keys**
  - Copy **Project URL** → `SUPABASE_URL`
  - Copy **Secret key** (sb_secret_...) → `SUPABASE_SECRET_KEY`
- **Supabase Dashboard** → **Settings** → **Database** → **Connection string**
  - Copy connection string → `DATABASE_URL`

## 2. Install & Run

```bash
# Activate venv (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run server
python run.py
# OR
uvicorn app.main:app --reload
```

## 3. Test API

Open browser: http://localhost:8000/docs

Try these endpoints:
- `GET /api/v1/properties` - List all properties
- `GET /api/v1/properties?source=zameen&beds=3` - Filter properties
- `GET /api/v1/properties/{id}` - Get single property

## 4. API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/properties` | List properties (with filters) |
| GET | `/api/v1/properties/{id}` | Get single property |
| POST | `/api/v1/properties` | Create property |
| PUT | `/api/v1/properties/{id}` | Update property |
| DELETE | `/api/v1/properties/{id}` | Delete property |
| GET | `/api/v1/properties/search/recommended` | Get recommended properties |

## 5. Next Steps

1. ✅ Backend is ready
2. ⏭️ Connect frontend to backend API
3. ⏭️ Replace mock data with real API calls
4. ⏭️ Add authentication (JWT)
5. ⏭️ Implement AI recommendations

