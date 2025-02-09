from typing import Optional, Dict, Any, List
from datetime import datetime
from pydantic import BaseModel, ConfigDict
from app.core.enums import AdminLevel, AdminPermission


class AdminAuditLogBase(BaseModel):
    action: str
    entity_type: str
    entity_id: Optional[str] = None
    details: Optional[Dict[str, Any]] = None
    ip_address: Optional[str] = None

    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
        use_enum_values=True
    )


class AdminAuditLogCreate(AdminAuditLogBase):
    admin_id: str


class AdminAuditLog(AdminAuditLogBase):
    id: str
    admin_id: str
    created_at: datetime


class AdminUserUpdate(BaseModel):
    admin_level: Optional[AdminLevel] = None
    permissions: Optional[List[AdminPermission]] = None

    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
        use_enum_values=True
    )


class AdminStats(BaseModel):
    total_users: int
    active_users: int
    total_events: int
    pending_events: int
    active_sponsors: int
    users_by_role: Dict[str, int]
    recent_events: List[Dict[str, Any]]

    model_config = ConfigDict(
        from_attributes=True
    )


class AdminUserActivity(BaseModel):
    active_today: int
    active_this_week: int
    active_this_month: int
    users_by_login_count: List[Dict[str, Any]]
    top_active_users: List[Dict[str, Any]]

    model_config = ConfigDict(
        from_attributes=True
    )
