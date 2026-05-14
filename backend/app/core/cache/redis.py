"""
Redis client singleton
"""
import redis
from app.core.configs.config import settings


def _create_client() -> redis.Redis:
    """
    Initialize and return a Redis client using settings.
    """
    return redis.Redis(
        host=settings.REDIS_HOST,
        port=settings.REDIS_PORT,
        username=settings.REDIS_USERNAME or None,
        password=settings.REDIS_PASSWORD or None,
        ssl=settings.REDIS_SSL,
        decode_responses=settings.REDIS_DECODE_RESPONSES,
    )


redis_client = _create_client()


