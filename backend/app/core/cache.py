"""
Redis Cache Utility
Handles caching for API responses
"""

import json
import redis
from typing import Optional, Any
from app.core.config import settings

# Create Redis connection
redis_client = redis.Redis(
    host=settings.REDIS_HOST,
    port=settings.REDIS_PORT,
    username=settings.REDIS_USERNAME,
    password=settings.REDIS_PASSWORD,
    decode_responses=settings.REDIS_DECODE_RESPONSES,
    socket_connect_timeout=5,
    socket_timeout=5,
    retry_on_timeout=True,
)


def get_cache_key(prefix: str, *args, **kwargs) -> str:
    """
    Generate a cache key from prefix and parameters.
    """
    key_parts = [prefix]
    
    # Add positional arguments
    for arg in args:
        if arg is not None:
            key_parts.append(str(arg))
    
    # Add keyword arguments (sorted for consistency)
    if kwargs:
        sorted_kwargs = sorted(kwargs.items())
        for key, value in sorted_kwargs:
            if value is not None:
                key_parts.append(f"{key}:{value}")
    
    return ":".join(key_parts)


def get_from_cache(key: str) -> Optional[Any]:
    """
    Get value from cache.
    Returns None if key doesn't exist or error occurs.
    """
    try:
        cached_value = redis_client.get(key)
        if cached_value:
            return json.loads(cached_value)
    except (redis.RedisError, json.JSONDecodeError) as e:
        print(f"Cache get error for key {key}: {e}")
    return None


def set_cache(key: str, value: Any, ttl: int = None) -> bool:
    """
    Set value in cache with optional TTL.
    Returns True if successful, False otherwise.
    """
    try:
        ttl = ttl or settings.CACHE_TTL_SECONDS
        serialized_value = json.dumps(value, default=str)
        redis_client.setex(key, ttl, serialized_value)
        return True
    except (redis.RedisError, TypeError) as e:
        print(f"Cache set error for key {key}: {e}")
    return False


def delete_cache(key: str) -> bool:
    """
    Delete a key from cache.
    Returns True if successful, False otherwise.
    """
    try:
        redis_client.delete(key)
        return True
    except redis.RedisError as e:
        print(f"Cache delete error for key {key}: {e}")
    return False


def delete_cache_pattern(pattern: str) -> int:
    """
    Delete all keys matching a pattern.
    Returns number of keys deleted.
    """
    try:
        keys = redis_client.keys(pattern)
        if keys:
            return redis_client.delete(*keys)
    except redis.RedisError as e:
        print(f"Cache delete pattern error for {pattern}: {e}")
    return 0


def clear_all_cache() -> bool:
    """
    Clear all cache (use with caution).
    """
    try:
        redis_client.flushdb()
        return True
    except redis.RedisError as e:
        print(f"Cache clear error: {e}")
    return False


def test_connection() -> bool:
    """
    Test Redis connection.
    """
    try:
        redis_client.ping()
        return True
    except redis.RedisError:
        return False


