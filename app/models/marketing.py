from sqlalchemy import Column, String, DateTime, JSON, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base_class import Base
from datetime import datetime
import uuid


class MarketingCampaign(Base):
    id = Column(
        String,
        primary_key=True,
        index=True,
        default=lambda: str(uuid.uuid4())
    )
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    type = Column(String, nullable=False)  # email, social, push, ai_generated
    target_audience = Column(JSON, nullable=False)
    status = Column(
        String,
        nullable=False,
        default="draft"
    )  # draft, active, completed
    metrics = Column(
        JSON,
        nullable=False,
        default=lambda: {
            "reach": 0,
            "engagement": 0,
            "conversions": 0
        }
    )
    created_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow
    )
    updated_at = Column(
        DateTime,
        nullable=False,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )
    
    # Creator of the campaign (admin or sponsor)
    creator_id = Column(String, ForeignKey("user.id"), nullable=False)
    creator = relationship("User", back_populates="marketing_campaigns")

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        if not self.id:
            self.id = str(uuid.uuid4())
        if not self.metrics:
            self.metrics = {"reach": 0, "engagement": 0, "conversions": 0}
