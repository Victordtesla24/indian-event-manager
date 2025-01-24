from typing import Any, Dict
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import crud, models
from app.api import deps
from app.models.user import UserRole

router = APIRouter()


@router.get("/analytics", response_model=Dict[str, Any])
def get_admin_analytics(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_admin_user),
) -> Any:
    """
    Get analytics data for admin dashboard.
    """
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
            "attendees": (
                len(event.attendees) if hasattr(event, 'attendees') else 0
            )
        }
        for event in recent_events
    ]

    return {
        "totalUsers": total_users,
        "activeUsers": active_users,
        "usersByRole": {
            "user": users_by_role.get(UserRole.USER, 0),
            "admin": users_by_role.get(UserRole.ADMIN, 0),
            "sponsor": users_by_role.get(UserRole.SPONSOR, 0),
        },
        "totalEvents": total_events,
        "pendingEvents": pending_events,
        "activeSponsors": active_sponsors,
        "recentEvents": recent_events_data,
    }


@router.get("/events/stats", response_model=Dict[str, Any])
def get_event_statistics(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_admin_user),
) -> Any:
    """
    Get detailed event statistics.
    """
    # Events by status
    events_by_status = crud.event.count_by_status_all(db)
    
    # Events by type
    events_by_type = crud.event.count_by_type(db)
    
    # Events by city
    events_by_city = crud.event.count_by_city(db)

    return {
        "eventsByStatus": events_by_status,
        "eventsByType": events_by_type,
        "eventsByCity": events_by_city,
    }


@router.get("/sponsors/stats", response_model=Dict[str, Any])
def get_sponsor_statistics(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_admin_user),
) -> Any:
    """
    Get detailed sponsor statistics.
    """
    # Active sponsors count
    active_sponsors = crud.user.count_by_role(db).get(UserRole.SPONSOR, 0)
    
    # Banners statistics
    total_banners = crud.banner.count(db)
    active_banners = crud.banner.count_active(db)
    
    # Events by sponsor
    events_by_sponsor = crud.event.count_by_sponsor(db)

    return {
        "activeSponsors": active_sponsors,
        "totalBanners": total_banners,
        "activeBanners": active_banners,
        "eventsBySponsor": events_by_sponsor,
    }
