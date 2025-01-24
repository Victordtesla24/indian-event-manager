from sqlalchemy import (
    Boolean, Column, String, DateTime, Enum, Integer,
    ARRAY, ForeignKey, JSON
)
import enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.permissions import AdminPermission
from app.db.base_class import Base
from app.models.marketing import MarketingCampaign  # noqa: F401


class UserRole(str, enum.Enum):
    USER = "user"
    ADMIN = "admin"
    SPONSOR = "sponsor"


class AdminLevel(str, enum.Enum):
    SUPER_ADMIN = "SUPER_ADMIN"
    ADMIN = "ADMIN"
    MODERATOR = "MODERATOR"


class AdminAuditLog(Base):
    id = Column(String, primary_key=True, index=True)
    admin_id = Column(
        String,
        ForeignKey("user.id"),
        nullable=False,
        index=True
    )
    action = Column(String, nullable=False)
    entity_type = Column(String, nullable=False)
    entity_id = Column(String, nullable=True)
    details = Column(JSON, nullable=True)
    ip_address = Column(String, nullable=True)
    created_at = Column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now()
    )

    # Relationships
    admin = relationship("User", back_populates="audit_logs")


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

    # Admin specific fields
    admin_level = Column(
        Enum(AdminLevel, name='adminlevel'),
        nullable=True
    )
    permissions = Column(
        JSON().with_variant(
            ARRAY(Enum(AdminPermission, name='adminpermission')),
            'postgresql'
        ),
        nullable=True,
        server_default='[]'
    )
    last_login = Column(DateTime(timezone=True), nullable=True)
    last_active = Column(DateTime(timezone=True), nullable=True)
    login_count = Column(Integer, nullable=False, server_default='0')

    # Relationships
    events = relationship("Event", back_populates="organizer")
    sponsor_profile = relationship(
        "Sponsor",
        back_populates="user",
        uselist=False
    )
    audit_logs = relationship("AdminAuditLog", back_populates="admin")
    marketing_campaigns = relationship(
        "MarketingCampaign",
        back_populates="creator"
    )

    @property
    def is_admin(self) -> bool:
        return self.role == UserRole.ADMIN

    @property
    def is_super_admin(self) -> bool:
        return self.is_admin and self.admin_level == AdminLevel.SUPER_ADMIN

    @property
    def is_sponsor(self) -> bool:
        return self.role == UserRole.SPONSOR

    def has_permission(self, permission: AdminPermission) -> bool:
        if not self.is_admin:
            return False
        if self.is_super_admin:
            return True
        return permission in (self.permissions or [])
