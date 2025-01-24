from typing import Any, List, Dict
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import crud
from app.models.user import User
from app.schemas.sponsor import (
    Sponsor, SponsorCreate, SponsorUpdate, SponsorAnalytics
)
from app.api import deps

router = APIRouter()


@router.post("/", response_model=Sponsor)
def create_sponsor(
    *,
    db: Session = Depends(deps.get_db),
    sponsor_in: SponsorCreate,
    current_user: User = Depends(deps.get_current_sponsor_user)
) -> Any:
    """
    Create new sponsor profile.
    """
    sponsor = crud.sponsor.get_by_user_id(db, user_id=current_user.id)
    if sponsor:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Sponsor profile already exists for this user"
        )
    sponsor = crud.sponsor.create(
        db,
        obj_in=sponsor_in,
        user_id=current_user.id
    )
    return sponsor


@router.get("/me", response_model=Sponsor)
def get_sponsor_me(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_sponsor_user)
) -> Any:
    """
    Get current sponsor profile.
    """
    sponsor = crud.sponsor.get_by_user_id(db, user_id=current_user.id)
    if not sponsor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sponsor profile not found"
        )
    return sponsor


@router.put("/me", response_model=Sponsor)
def update_sponsor_me(
    *,
    db: Session = Depends(deps.get_db),
    sponsor_in: SponsorUpdate,
    current_user: User = Depends(deps.get_current_sponsor_user)
) -> Any:
    """
    Update current sponsor profile.
    """
    sponsor = crud.sponsor.get_by_user_id(db, user_id=current_user.id)
    if not sponsor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sponsor profile not found"
        )
    sponsor = crud.sponsor.update(db, db_obj=sponsor, obj_in=sponsor_in)
    return sponsor


@router.get("/analytics/me", response_model=SponsorAnalytics)
def get_sponsor_analytics(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_sponsor_user)
) -> Any:
    """
    Get current sponsor analytics.
    """
    sponsor = crud.sponsor.get_by_user_id(db, user_id=current_user.id)
    if not sponsor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sponsor profile not found"
        )
    return {
        "total_views": sponsor.total_views,
        "total_clicks": sponsor.total_clicks,
        "analytics": sponsor.analytics
    }


@router.get(
    "/",
    response_model=List[Sponsor],
    dependencies=[Depends(deps.get_current_admin_user)]
)
def get_sponsors(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100
) -> Any:
    """
    Retrieve sponsors. Admin only.
    """
    sponsors = crud.sponsor.get_multi(db, skip=skip, limit=limit)
    return sponsors


@router.get("/{sponsor_id}", response_model=Sponsor)
def get_sponsor(
    sponsor_id: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user)
) -> Any:
    """
    Get sponsor by ID.
    """
    sponsor = crud.sponsor.get(db, id=sponsor_id)
    if not sponsor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sponsor not found"
        )
    return sponsor


@router.post("/{sponsor_id}/track/view")
def track_sponsor_view(
    sponsor_id: str,
    db: Session = Depends(deps.get_db)
) -> Dict[str, Any]:
    """
    Track sponsor profile view.
    """
    sponsor = crud.sponsor.increment_views(db, sponsor_id=sponsor_id)
    if not sponsor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sponsor not found"
        )
    return {"success": True, "total_views": sponsor.total_views}


@router.post("/{sponsor_id}/track/click")
def track_sponsor_click(
    sponsor_id: str,
    db: Session = Depends(deps.get_db)
) -> Dict[str, Any]:
    """
    Track sponsor link/banner click.
    """
    sponsor = crud.sponsor.increment_clicks(db, sponsor_id=sponsor_id)
    if not sponsor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sponsor not found"
        )
    return {"success": True, "total_clicks": sponsor.total_clicks}
