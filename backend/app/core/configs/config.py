from pydantic_settings import BaseSettings
from typing import Optional, Union
from pydantic import ConfigDict


class Settings(BaseSettings):
    # Supabase Configuration (New API Keys)
    SUPABASE_URL: str
    SUPABASE_SECRET_KEY: str  # New secret key (sb_secret_...)
    SUPABASE_PUBLISHABLE_KEY: Optional[str] = None  # New publishable key (sb_publishable_...)
    
    # Database Configuration (Direct PostgreSQL connection)
    DATABASE_URL: str  # PostgreSQL connection string from Supabase
    
    # API Configuration
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "PropertyWalay API"
    VERSION: str = "1.0.0"
    
    # CORS - Can be a list or comma-separated string
    BACKEND_CORS_ORIGINS: Union[str, list[str]] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
    ]
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Redis Configuration
    REDIS_HOST: str 
    REDIS_PORT: int
    REDIS_USERNAME: str
    REDIS_PASSWORD: str 
    REDIS_DECODE_RESPONSES: bool 
    
    # Chatbot Configuration
    CHATBOT_WEBHOOK_URL: str = ""

    # Meeting Configuration
    MEETING_WEBHOOK_URL: str = ""

    # Whisper (local speech-to-text) Configuration
    WHISPER_MODEL: str = "base"          # tiny|base|small|medium|large-v3
    WHISPER_DEVICE: str = "cpu"          # cpu or cuda
    WHISPER_COMPUTE_TYPE: str = "int8"   # int8 for fast CPU inference
    WHISPER_MAX_AUDIO_MB: int = 10
    WHISPER_MAX_DURATION_SECONDS: int = 60
    
    # Cache Configuration
    CACHE_TTL_SECONDS: int = 300  # 5 minutes default cache TTL
    
    # Optional fields (for backward compatibility with existing .env files)
    SUPABASE_SERVICE_ROLE_KEY: Optional[str] = None  # Legacy key (ignored)
    SUPABASE_ANON_KEY: Optional[str] = None  # Legacy key (ignored)
    ENVIRONMENT: Optional[str] = None
    DEBUG: Optional[str] = None
    PORT: Optional[str] = None
    
    model_config = ConfigDict(
        env_file=".env",
        case_sensitive=True,
        extra="ignore",  # Ignore extra fields in .env file
    )


settings = Settings()

