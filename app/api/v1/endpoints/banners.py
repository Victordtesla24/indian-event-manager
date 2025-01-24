from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.api import deps

router = APIRouter()


@router.post("/", response_model=schemas.Banner)
def create_banner(
    *,
    db: Session = Depends(deps.get_db),
    banner_in: schemas.BannerCreate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new banner. Only sponsors can create banners.
    """
    # Check if user is a sponsor
    sponsor = crud.sponsor.get_by_user_id(db, user_id=str(current_user.id))
    if not sponsor:
        raise HTTPException(
            status_code=403,
            detail="Only sponsors can create banners"
        )
    
    # Verify the sponsor_id matches the current user's sponsor profile
    if banner_in.sponsor_id != sponsor.id:
        raise HTTPException(
            status_code=400,
            detail="Invalid sponsor_id"
        )
    
    banner = crud.banner.create(db=db, obj_in=banner_in)
    return banner


@router.get("/active/", response_model=List[schemas.Banner])
def list_active_banners(
    *,
    db: Session = Depends(deps.get_db),
    position: str = None,
) -> Any:
    """
    Retrieve active banners. Optionally filter by position.
    """
    banners = crud.banner.get_active_banners(db=db, position=position)
    return banners


@router.get("/sponsor/{sponsor_id}", response_model=List[schemas.Banner])
def list_sponsor_banners(
    sponsor_id: str,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get all banners for a specific sponsor.
    """
    # Check if user is authorized
    sponsor = crud.sponsor.get_by_user_id(db, user_id=str(current_user.id))
    if not (
        sponsor and sponsor.id == sponsor_id or
        current_user.is_superuser
    ):
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions"
        )
    
    banners = crud.banner.get_sponsor_banners(
        db=db, sponsor_id=sponsor_id
    )
    return banners


@router.put("/{banner_id}", response_model=schemas.Banner)
def update_banner(
    *,
    db: Session = Depends(deps.get_db),
    banner_id: str,
    banner_in: schemas.BannerUpdate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update banner. Only the owner sponsor or admin can update.
    """
    banner = crud.banner.get(db=db, id=banner_id)
    if not banner:
        raise HTTPException(
            status_code=404,
            detail="Banner not found"
        )
    
    # Check if user is authorized
    sponsor = crud.sponsor.get_by_user_id(db, user_id=str(current_user.id))
    if not (
        sponsor and sponsor.id == banner.sponsor_id or
        current_user.is_superuser
    ):
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions"
        )
    
    banner = crud.banner.update(
        db=db,
        db_obj=banner,
        obj_in=banner_in
    )
    return banner


@router.post("/{banner_id}/view", response_model=schemas.Banner)
def record_banner_view(
    *,
    db: Session = Depends(deps.get_db),
    banner_id: str,
) -> Any:
    """
    Record a view for the banner.
    """
    banner = crud.banner.increment_views(db=db, banner_id=banner_id)
    if not banner:
        raise HTTPException(
            status_code=404,
            detail="Banner not found"
        )
    return banner


@router.post("/{banner_id}/click", response_model=schemas.Banner)
def record_banner_click(
    *,
    db: Session = Depends(deps.get_db),
    banner_id: str,
) -> Any:
    """
    Record a click for the banner.
    """
    banner = crud.banner.increment_clicks(db=db, banner_id=banner_id)
    if not banner:
        raise HTTPException(
            status_code=404,
            detail="Banner not found"
        )
    return banner
