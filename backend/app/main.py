from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
import logging

from app.core.configs.config import settings
from app.core.cache.cache import test_connection
from app.api.routes.property import properties
from app.api.routes.ppt import ppt_exports
from app.api.routes.trends import trends
from app.api.routes.chatbot import chatbot

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="PropertyWalay API - AI-powered real estate platform for Pakistan",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Parse CORS origins - handle both list and string formats
def parse_cors_origins(origins):
    """Parse CORS origins from string or list."""
    if isinstance(origins, str):
        # Split by comma and strip whitespace
        return [origin.strip() for origin in origins.split(",") if origin.strip()]
    return origins

cors_origins = parse_cors_origins(settings.BACKEND_CORS_ORIGINS)

# Log CORS origins for debugging
logger.info(f"CORS Origins configured: {cors_origins}")

# Helper function to get CORS headers
def get_cors_headers(request: Request) -> dict:
    """Get CORS headers based on request origin."""
    origin = request.headers.get("origin")
    # If origin is in allowed origins, use it; otherwise use first allowed origin
    if origin and origin in cors_origins:
        return {
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
        }
    elif cors_origins:
        # Fallback to first allowed origin if request origin doesn't match
        return {
            "Access-Control-Allow-Origin": cors_origins[0],
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
        }
    return {}

# Configure CORS - MUST be added before exception handlers
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Exception handlers - order matters: most specific first
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    """
    HTTP exception handler with CORS headers.
    """
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
        headers=get_cors_headers(request)
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Validation exception handler with CORS headers.
    """
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": exc.errors(), "body": exc.body},
        headers=get_cors_headers(request)
    )

# Global exception handler - must be last to catch everything else
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Global exception handler that ensures CORS headers are added to all error responses.
    """
    logger.error(f"Unhandled exception: {type(exc).__name__}: {str(exc)}", exc_info=True)
    
    # Check if DEBUG is set and is truthy
    debug_mode = getattr(settings, 'DEBUG', None)
    if isinstance(debug_mode, str):
        debug_mode = debug_mode.lower() in ('true', '1', 'yes')
    
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "Internal server error",
            "error": str(exc) if debug_mode else "An error occurred"
        },
        headers=get_cors_headers(request)
    )

# Include routers
app.include_router(properties.router, prefix=settings.API_V1_STR)
app.include_router(ppt_exports.router, prefix=settings.API_V1_STR)
app.include_router(trends.router, prefix=settings.API_V1_STR)
app.include_router(chatbot.router, prefix=settings.API_V1_STR)


@app.get("/")
def root():
    """Root endpoint"""
    return {
        "message": "Welcome to PropertyWalay API",
        "version": settings.VERSION,
        "docs": "/docs",
    }


@app.get("/health")
def health_check():
    """Health check endpoint"""
    redis_connected = test_connection()
    return {
        "status": "healthy",
        "redis": "connected" if redis_connected else "disconnected"
    }