from typing import List, Optional
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.user import AdminAuditLog
from app.schemas.admin import (
    AdminAuditLogCreate,
    AdminAuditLog as AdminAuditLogSchema
)


class CRUDAdmin(
    CRUDBase[AdminAuditLog, AdminAuditLogCreate, AdminAuditLogSchema]
):
    def get_audit_logs(
        self,
        db: Session,
        *,
        skip: int = 0,
        limit: int = 100,
        admin_id: Optional[str] = None
    ) -> List[AdminAuditLog]:
        query = db.query(self.model)
        if admin_id:
            query = query.filter(self.model.admin_id == admin_id)
        return (
            query.order_by(self.model.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_audit_logs_by_entity(
        self,
        db: Session,
        *,
        entity_type: str,
        entity_id: str,
        skip: int = 0,
        limit: int = 100
    ) -> List[AdminAuditLog]:
        return (
            db.query(self.model)
            .filter(
                self.model.entity_type == entity_type,
                self.model.entity_id == entity_id
            )
            .order_by(self.model.created_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )


admin = CRUDAdmin(AdminAuditLog)
