from enum import Enum
from typing import TYPE_CHECKING
from sqlalchemy import (
    Column, String, DateTime, ForeignKey, Enum as SQLEnum, Boolean
)
from sqlalchemy.orm import relationship

from app.db.base_class import Base

if TYPE_CHECKING:
    from .user import User  # noqa: F401


class EventStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class Event(Base):
    id = Column(String, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    location = Column(String)
    city = Column(String, index=True)
    event_date = Column(DateTime)
    event_type = Column(String, index=True)
    image_url = Column(String, nullable=True)
    status = Column(SQLEnum(EventStatus), default=EventStatus.PENDING)
    is_sponsored = Column(Boolean, default=False)
    organizer_id = Column(String, ForeignKey("user.id"))
    organizer = relationship("User", back_populates="events")
