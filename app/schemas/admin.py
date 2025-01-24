from typing import Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel
from app.models.user import AdminLevel
from app.core.permissions import AdminPermission


class AdminAuditLogBase(BaseModel):
    action: str
    entity_type: str
    entity_id: Optional[str] = None
    details: Optional[Dict[str, Any]] = None
    ip_address: Optional[str] = None


class AdminAuditLogCreate(AdminAuditLogBase):
    admin_id: str


class AdminAuditLog(AdminAuditLogBase):
    id: str
    admin_id: str
    created_at: datetime

    class Config:
        orm_mode = True


class AdminUserUpdate(BaseModel):
    admin_level: Optional[AdminLevel] = None
    permissions: Optional[list[AdminPermission]] = None

    class Config:
        orm_mode = True


class AdminStats(BaseModel):
    total_users: int
    active_users: int
    total_events: int
    pending_events: int
    active_sponsors: int
    users_by_role: Dict[str, int]
    recent_events: list[Dict[str, Any]]

    class Config:
        orm_mode = True


class AdminUserActivity(BaseModel):
    active_today: int
    active_this_week: int
    active_this_month: int
    users_by_login_count: list[Dict[str, Any]]
    top_active_users: list[Dict[str, Any]]

    class Config:
        orm_mode = True
