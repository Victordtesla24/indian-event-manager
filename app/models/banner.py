from sqlalchemy import (
    Column, String, DateTime, ForeignKey, Boolean, Integer
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base_class import Base


class Banner(Base):
    id = Column(String, primary_key=True, index=True)
    sponsor_id = Column(String, ForeignKey("sponsor.id"), nullable=False)
    image_url = Column(String, nullable=False)
    link_url = Column(String, nullable=False)
    position = Column(
        String, nullable=False
    )  # e.g., "top", "sidebar", "bottom"
    is_active = Column(Boolean, default=True)
    start_date = Column(DateTime(timezone=True), nullable=False)
    end_date = Column(DateTime(timezone=True), nullable=False)
    views_count = Column(Integer, default=0)
    clicks_count = Column(Integer, default=0)
    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )

    # Relationships
    sponsor = relationship("Sponsor", back_populates="banners")
