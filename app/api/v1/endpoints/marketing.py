from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, models, schemas
from app.api import deps
from app.models.user import AdminPermission

router = APIRouter()


@router.get("/", response_model=schemas.MarketingCampaignList)
def list_campaigns(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(
        deps.get_current_user
    ),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """List marketing campaigns."""
    if current_user.is_admin:
        campaigns = crud.marketing_campaign.get_multi(db, skip=skip, limit=limit)
        total = crud.marketing_campaign.count(db)
    else:
        campaigns = crud.marketing_campaign.get_by_creator(
            db,
            creator_id=str(current_user.id),
            skip=skip,
            limit=limit
        )
        total = len(campaigns)
    
    return schemas.MarketingCampaignList(
        items=campaigns,
        total=total
    )


@router.post("/", response_model=schemas.MarketingCampaign)
def create_campaign(
    *,
    db: Session = Depends(deps.get_db),
    campaign_in: schemas.MarketingCampaignCreate,
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """Create new marketing campaign."""
    if not (current_user.is_admin or current_user.is_sponsor):
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions to create campaigns"
        )
    
    if current_user.is_admin:
        if not current_user.has_permission(AdminPermission.MANAGE_MARKETING):
            raise HTTPException(
                status_code=403,
                detail="Admin lacks marketing management permission"
            )
    
    campaign = crud.marketing_campaign.create(
        db,
        obj_in=campaign_in,
        creator_id=str(current_user.id)
    )
    return campaign


@router.get("/{campaign_id}", response_model=schemas.MarketingCampaign)
def get_campaign(
    campaign_id: str,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """Get specific marketing campaign."""
    campaign = crud.marketing_campaign.get(db, id=campaign_id)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    if (not current_user.is_admin and 
            campaign.creator_id != str(current_user.id)):
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions to access this campaign"
        )
    
    return campaign


@router.put("/{campaign_id}", response_model=schemas.MarketingCampaign)
def update_campaign(
    campaign_id: str,
    campaign_in: schemas.MarketingCampaignUpdate,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """Update marketing campaign."""
    campaign = crud.marketing_campaign.get(db, id=campaign_id)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    if (not current_user.is_admin and 
            campaign.creator_id != str(current_user.id)):
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions to modify this campaign"
        )
    
    campaign = crud.marketing_campaign.update(
        db,
        db_obj=campaign,
        obj_in=campaign_in
    )
    return campaign


@router.delete("/{campaign_id}")
def delete_campaign(
    campaign_id: str,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_user),
) -> Any:
    """Delete marketing campaign."""
    campaign = crud.marketing_campaign.get(db, id=campaign_id)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    if (not current_user.is_admin and 
            campaign.creator_id != str(current_user.id)):
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions to delete this campaign"
        )
    
    crud.marketing_campaign.remove(db, id=campaign_id)
    return {"message": "Campaign deleted successfully"}


@router.get("/stats/overview", response_model=dict)
def get_campaign_stats(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_admin_user),
) -> Any:
    """Get marketing campaign statistics."""
    if not current_user.has_permission(AdminPermission.VIEW_ANALYTICS):
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions to view campaign statistics"
        )
    
    return crud.marketing_campaign.get_campaign_stats(db)


@router.post("/{campaign_id}/metrics")
def update_campaign_metrics(
    campaign_id: str,
    metrics: schemas.MarketingCampaignMetrics,
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_admin_user),
) -> Any:
    """Update campaign metrics."""
    if not current_user.has_permission(AdminPermission.MANAGE_MARKETING):
        raise HTTPException(
            status_code=403,
            detail="Not enough permissions to update campaign metrics"
        )
    
    campaign = crud.marketing_campaign.update_metrics(
        db,
        campaign_id=campaign_id,
        metrics=metrics.dict()
    )
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    
    return {"message": "Campaign metrics updated successfully"}
