import uuid
from datetime import datetime
from typing import Optional


def generate_uuid() -> str:
    """Generate a UUID string."""
    return str(uuid.uuid4())


def get_current_time() -> datetime:
    """Get current time with timezone."""
    return datetime.now()


def format_datetime(dt: Optional[datetime]) -> Optional[str]:
    """Format datetime to ISO format string."""
    if dt is None:
        return None
    return dt.isoformat()


def parse_datetime(dt_str: Optional[str]) -> Optional[datetime]:
    """Parse ISO format string to datetime."""
    if dt_str is None:
        return None
    return datetime.fromisoformat(dt_str)
