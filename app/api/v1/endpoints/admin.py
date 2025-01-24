from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from app import crud, models, schemas
from app.api import deps
from app.models.user import UserRole, AdminPermission, AdminLevel
from datetime import datetime, timedelta
from starlette.datastructures import Address

router = APIRouter()


def log_admin_action(
    db: Session,
    admin: models.User,
    action: str,
    entity_type: str,
    entity_id: str = None,
    details: dict = None,
    request: Request = None
) -> None:
    """Log admin actions for audit purposes."""
    ip_address: Optional[str] = None
    if request and isinstance(request.client, Address):
        ip_address = request.client.host
    
    audit_log = schemas.AdminAuditLogCreate(
        admin_id=str(admin.id),
        action=action,
        entity_type=entity_type,
        entity_id=entity_id,
        details=details,
        ip_address=ip_address
    )
    crud.admin.create(db, obj_in=audit_log)


def check_admin_permission(
    user: models.User,
    permission: AdminPermission
) -> None:
    """Check if admin has required permission."""
    if not user.has_permission(permission):
        raise HTTPException(
            status_code=403,
            detail=f"Admin lacks required permission: {permission}"
        )


@router.get("/analytics", response_model=schemas.AdminStats)
def get_admin_analytics(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_admin_user),
) -> Any:
    """Get analytics data for admin dashboard."""
    try:
        check_admin_permission(current_user, AdminPermission.VIEW_ANALYTICS)

        # User statistics
        total_users = crud.user.count(db)
        active_users = crud.user.count_active(db)
        users_by_role = crud.user.count_by_role(db)

        # Event statistics
        total_events = crud.event.count(db)
        pending_events = crud.event.count_by_status(db, status="pending")
        active_sponsors = crud.user.count_by_role(db).get(UserRole.SPONSOR, 0)

        # Recent events
        recent_events = crud.event.get_recent(db, limit=5)
        recent_events_data = [
            {
                "id": str(event.id),
                "title": event.title,
                "date": event.event_date.isoformat(),
                "attendees": len(getattr(event, 'attendees', []))
            }
            for event in recent_events
        ]

        response_data = {
            "total_users": total_users,
            "active_users": active_users,
            "total_events": total_events,
            "pending_events": pending_events,
            "active_sponsors": active_sponsors,
            "users_by_role": {
                "user": users_by_role.get(UserRole.USER, 0),
                "admin": users_by_role.get(UserRole.ADMIN, 0),
                "sponsor": users_by_role.get(UserRole.SPONSOR, 0),
            },
            "recent_events": recent_events_data
        }

        return JSONResponse(content=response_data)
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )


@router.get("/audit-logs", response_model=List[schemas.AdminAuditLog])
def get_audit_logs(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_admin_user),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """Get admin audit logs."""
    check_admin_permission(current_user, AdminPermission.VIEW_ANALYTICS)
    return crud.admin.get_audit_logs(db, skip=skip, limit=limit)


@router.get("/users/activity", response_model=schemas.AdminUserActivity)
def get_user_activity(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_admin_user),
) -> Any:
    """Get user activity statistics."""
    check_admin_permission(current_user, AdminPermission.VIEW_ANALYTICS)

    today_start = datetime.now().replace(
        hour=0, minute=0, second=0, microsecond=0
    )
    active_today = crud.user.count_active_since(db, since=today_start)
    active_this_week = crud.user.count_active_since(
        db,
        since=datetime.now() - timedelta(days=7)
    )
    active_this_month = crud.user.count_active_since(
        db,
        since=datetime.now() - timedelta(days=30)
    )
    
    return schemas.AdminUserActivity(
        active_today=active_today,
        active_this_week=active_this_week,
        active_this_month=active_this_month,
        users_by_login_count=crud.user.get_users_by_login_count(db),
        top_active_users=crud.user.get_most_active_users(db, limit=10)
    )


@router.post("/users/{user_id}/permissions")
def update_user_permissions(
    user_id: str,
    permissions: List[AdminPermission],
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_admin_user),
    request: Request = None,
) -> Dict[str, Any]:
    """Update admin user permissions."""
    check_admin_permission(current_user, AdminPermission.MANAGE_USERS)
    
    target_user = crud.user.get(db, id=user_id)
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if target_user.is_super_admin and not current_user.is_super_admin:
        raise HTTPException(
            status_code=403,
            detail="Only super admins can modify super admin permissions"
        )
    
    update_data = {"permissions": [p.value for p in permissions]}
    crud.user.update(db, db_obj=target_user, obj_in=update_data)
    
    log_admin_action(
        db,
        current_user,
        "update_permissions",
        "user",
        user_id,
        {"permissions": [p.value for p in permissions]},
        request
    )
    
    return {"message": "Permissions updated successfully"}


@router.post("/users/{user_id}/admin-level")
def update_admin_level(
    user_id: str,
    admin_level: AdminLevel,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_admin_user),
    request: Request = None,
) -> Dict[str, Any]:
    """Update admin user level."""
    if not current_user.is_super_admin:
        raise HTTPException(
            status_code=403,
            detail="Only super admins can modify admin levels"
        )
    
    target_user = crud.user.get(db, id=user_id)
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    update_data = {"admin_level": admin_level.value}
    crud.user.update(db, db_obj=target_user, obj_in=update_data)
    
    log_admin_action(
        db,
        current_user,
        "update_admin_level",
        "user",
        user_id,
        {"admin_level": admin_level.value},
        request
    )
    
    return {"message": "Admin level updated successfully"}


@router.get("/events/stats", response_model=Dict[str, Any])
def get_event_statistics(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_admin_user),
) -> Any:
    """Get detailed event statistics."""
    check_admin_permission(current_user, AdminPermission.VIEW_ANALYTICS)
    
    return {
        "eventsByStatus": crud.event.count_by_status_all(db),
        "eventsByType": crud.event.count_by_type(db),
        "eventsByCity": crud.event.count_by_city(db),
    }


@router.get("/sponsors/stats", response_model=Dict[str, Any])
def get_sponsor_statistics(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_admin_user),
) -> Any:
    """Get detailed sponsor statistics."""
    check_admin_permission(current_user, AdminPermission.VIEW_ANALYTICS)
    
    return {
        "activeSponsors": crud.user.count_by_role(db).get(UserRole.SPONSOR, 0),
        "totalBanners": crud.banner.count(db),
        "activeBanners": crud.banner.count_active(db),
        "eventsBySponsor": crud.event.count_by_sponsor(db),
    }
