from sqlalchemy import Boolean, Column, String, DateTime, Enum
import enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.base_class import Base


class UserRole(str, enum.Enum):
    USER = "user"
    ADMIN = "admin"
    SPONSOR = "sponsor"


class User(Base):
    id = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, index=True)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean(), default=True)
    is_superuser = Column(Boolean(), default=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.USER)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

    # Relationships
    events = relationship("Event", back_populates="organizer")
    sponsor_profile = relationship(
        "Sponsor",
        back_populates="user",
        uselist=False
    )
