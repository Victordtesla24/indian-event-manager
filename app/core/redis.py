from typing import Optional
import redis
from app.core.config import settings

# Redis client for session management
redis_client = redis.Redis(
    host=settings.REDIS_HOST,
    port=settings.REDIS_PORT,
    db=0,
    decode_responses=True
)

def set_session(session_id: str, user_id: str, expires_in: int = 7200) -> None:
    """Set session with expiration (default 2 hours)"""
    redis_client.setex(f"session:{session_id}", expires_in, user_id)

def get_session(session_id: str) -> Optional[str]:
    """Get user_id from session"""
    return redis_client.get(f"session:{session_id}")

def delete_session(session_id: str) -> None:
    """Delete session"""
    redis_client.delete(f"session:{session_id}")

def extend_session(session_id: str, expires_in: int = 7200) -> None:
    """Extend session expiration"""
    user_id = get_session(session_id)
    if user_id:
        set_session(session_id, user_id, expires_in)

def get_active_sessions(user_id: str) -> list[str]:
    """Get all active sessions for a user"""
    sessions = []
    for key in redis_client.scan_iter(f"session:*"):
        if redis_client.get(key) == user_id:
            sessions.append(key.split(":")[-1])
    return sessions

def clear_user_sessions(user_id: str) -> None:
    """Clear all sessions for a user"""
    for session_id in get_active_sessions(user_id):
        delete_session(session_id)

# Rate limiting
def increment_request_count(key: str, window: int = 60) -> int:
    """Increment request count for rate limiting"""
    current = redis_client.incr(key)
    if current == 1:
        redis_client.expire(key, window)
    return current

def get_request_count(key: str) -> int:
    """Get current request count"""
    count = redis_client.get(key)
    return int(count) if count else 0
