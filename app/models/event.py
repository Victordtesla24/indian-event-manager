from sqlalchemy import Boolean, Column, String, DateTime, Text, ForeignKey, Integer, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base_class import Base


class Event(Base):
    id = Column(String, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=False)
    location = Column(String, nullable=False)
    event_date = Column(DateTime(timezone=True), nullable=False)
    event_type = Column(String, nullable=False)  # Cultural, Religious, etc.
    image_url = Column(String)
    organizer_id = Column(String, ForeignKey("user.id"), nullable=False)
    is_approved = Column(Boolean(), default=False)
    is_featured = Column(Boolean(), default=False)
    max_participants = Column(Integer)
    price = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

    # Relationships
    organizer = relationship("User", back_populates="events") 