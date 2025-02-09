from typing import List, Optional, TYPE_CHECKING
from sqlalchemy import (
    Boolean, String, DateTime, Enum, Integer,
    ARRAY, ForeignKey, JSON, func
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.enums import UserRole, AdminLevel, AdminPermission
from app.db.base_class import Base

if TYPE_CHECKING:
    from .event import Event
    from .sponsor import Sponsor
    from .marketing import MarketingCampaign


class AdminAuditLog(Base):
    id: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    admin_id: Mapped[str] = mapped_column(
        String,
        ForeignKey("user.id"),
        nullable=False,
        index=True
    )
    action: Mapped[str] = mapped_column(String, nullable=False)
    entity_type: Mapped[str] = mapped_column(String, nullable=False)
    entity_id: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    details: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    ip_address: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    created_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now()
    )

    # Relationships
    admin: Mapped["User"] = relationship("User", back_populates="audit_logs")


class User(Base):
    id: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String, unique=True, index=True, nullable=False)
    full_name: Mapped[Optional[str]] = mapped_column(String, index=True)
    hashed_password: Mapped[str] = mapped_column(String, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean(), default=True)
    is_superuser: Mapped[bool] = mapped_column(Boolean(), default=False)
    role: Mapped[UserRole] = mapped_column(Enum(UserRole), nullable=False, default=UserRole.USER)
    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now()
    )

    # Admin specific fields
    admin_level: Mapped[Optional[AdminLevel]] = mapped_column(
        Enum(AdminLevel, name='adminlevel'),
        nullable=True
    )
    permissions: Mapped[Optional[List[AdminPermission]]] = mapped_column(
        JSON().with_variant(
            ARRAY(Enum(AdminPermission, name='adminpermission')),
            'postgresql'
        ),
        nullable=True,
        server_default='[]'
    )
    last_login: Mapped[Optional[DateTime]] = mapped_column(DateTime(timezone=True), nullable=True)
    last_active: Mapped[Optional[DateTime]] = mapped_column(DateTime(timezone=True), nullable=True)
    login_count: Mapped[int] = mapped_column(Integer, nullable=False, server_default='0')

    # Relationships
    events: Mapped[List["Event"]] = relationship("Event", back_populates="organizer")
    sponsor_profile: Mapped[Optional["Sponsor"]] = relationship(
        "Sponsor",
        back_populates="user",
        uselist=False
    )
    audit_logs: Mapped[List[AdminAuditLog]] = relationship(AdminAuditLog, back_populates="admin")
    marketing_campaigns: Mapped[List["MarketingCampaign"]] = relationship(
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
