# PropertyWalay Backend API

FastAPI backend for PropertyWalay - AI-powered real estate platform for Pakistan.

## Setup Instructions

### 1. Install Dependencies

```bash
# Activate virtual environment (if using venv)
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Supabase Configuration (New API Keys)
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SECRET_KEY=sb_secret_your_secret_key_here
SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_publishable_key_here

# Database Configuration
# Get from Supabase Dashboard > Settings > Database > Connection string
# Use "Connection pooling" or "Direct connection"
DATABASE_URL=postgresql://postgres:your_password@your-project-ref.supabase.co:5432/postgres

# API Configuration
API_V1_STR=/api/v1
PROJECT_NAME=PropertyWalay API
VERSION=1.0.0

# CORS Origins
BACKEND_CORS_ORIGINS=http://localhost:3000,http://localhost:3001

# Security (Change in production!)
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Redis (optional caching — matches Redis Cloud / StackExchange.Redis style)
# C#: EndPoints={{host, port}}, User=default, Password=...  →  same values here:
REDIS_HOST=redis-xxxxx.cXXX.us-east-X-X.ec2.cloud.redislabs.com
REDIS_PORT=18571
REDIS_USERNAME=default
REDIS_PASSWORD=your_redis_cloud_password
REDIS_DECODE_RESPONSES=True
REDIS_SSL=true
CACHE_TTL_SECONDS=300
```

### 2b. Redis Cloud (StackExchange.Redis equivalent)

If you use **Redis Cloud**, map your C# `ConfigurationOptions` to `.env` like this:

| C# / Redis Cloud | Backend `.env` |
|------------------|----------------|
| `EndPoints` host | `REDIS_HOST` |
| `EndPoints` port | `REDIS_PORT` |
| `User` (often `default`) | `REDIS_USERNAME` |
| `Password` | `REDIS_PASSWORD` |
| TLS (typical for `*.cloud.redislabs.com`) | `REDIS_SSL=true` |

Local Redis without TLS: set `REDIS_SSL=false` and `REDIS_HOST=127.0.0.1`, `REDIS_PORT=6379`.

### 3. Get Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API** → **API Keys**
4. Copy:
   - **Project URL** → `SUPABASE_URL`
   - **Secret key** (sb_secret_...) → `SUPABASE_SECRET_KEY`
   - **Publishable key** (sb_publishable_...) → `SUPABASE_PUBLISHABLE_KEY`
5. Go to **Settings** → **Database** → **Connection string**
6. Copy the connection string → `DATABASE_URL`

### 4. Run the Server

```bash
# Development mode with auto-reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Production mode
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

The API will be available at:
- API: http://localhost:8000
- Docs: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## API Endpoints

### Properties

- `GET /api/v1/properties` - List properties with filters and pagination
- `GET /api/v1/properties/{property_id}` - Get single property
- `POST /api/v1/properties` - Create new property
- `PUT /api/v1/properties/{property_id}` - Update property
- `DELETE /api/v1/properties/{property_id}` - Delete property
- `GET /api/v1/properties/search/recommended` - Get recommended properties

### Query Parameters for List Properties

- `source` - Filter by source (graana, lamudi, zameen)
- `prop_type` - Filter by property type
- `prop_subtype` - Filter by property subtype
- `min_price` - Minimum price
- `max_price` - Maximum price
- `currency` - Currency filter
- `beds` - Number of bedrooms
- `baths` - Number of bathrooms
- `area_name` - Area/location name
- `min_area_size` - Minimum area size
- `max_area_size` - Maximum area size
- `page` - Page number (default: 1)
- `page_size` - Items per page (default: 20, max: 100)

## Example API Calls

### List Properties
```bash
curl http://localhost:8000/api/v1/properties?source=zameen&beds=3&page=1&page_size=10
```

### Get Single Property
```bash
curl http://localhost:8000/api/v1/properties/{property_id}
```

### Create Property
```bash
curl -X POST http://localhost:8000/api/v1/properties \
  -H "Content-Type: application/json" \
  -d '{
    "source": "zameen",
    "source_id": "12345",
    "title": "3 Bed Apartment in DHA",
    "prop_type": "apartment",
    "beds": 3,
    "baths": 2,
    "current_price": 12000000,
    "currency": "PKR"
  }'
```

## Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI application
│   ├── core/
│   │   ├── config.py        # Settings and configuration
│   │   └── database.py      # Database connection
│   ├── models/
│   │   └── property.py      # SQLAlchemy models
│   ├── schemas/
│   │   └── property.py      # Pydantic schemas
│   ├── api/
│   │   ├── deps.py          # Dependencies
│   │   └── routes/
│   │       └── properties.py # API routes
│   └── services/            # Business logic (future)
├── requirements.txt
└── .env                      # Environment variables (create this)
```

## Notes

- Uses **new Supabase API keys** (publishable/secret) instead of legacy keys
- Direct PostgreSQL connection for better performance
- SQLAlchemy ORM for database operations
- Automatic API documentation at `/docs`
- CORS enabled for frontend integration

