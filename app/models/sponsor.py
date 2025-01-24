from sqlalchemy import Column, String, DateTime, ForeignKey, Integer, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.db.base_class import Base


class Sponsor(Base):
    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("user.id"), nullable=False)
    company_name = Column(String, nullable=False)
    description = Column(String)
    website = Column(String)
    logo_url = Column(String)
    banner_url = Column(String)
    contact_email = Column(String, nullable=False)
    contact_phone = Column(String)
    analytics = Column(JSON, default={})
    total_views = Column(Integer, default=0)
    total_clicks = Column(Integer, default=0)
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
    user = relationship("User", back_populates="sponsor_profile")
    banners = relationship("Banner", back_populates="sponsor")
