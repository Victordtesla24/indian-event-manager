from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.marketing import MarketingCampaign
from app.schemas.marketing import (
    MarketingCampaignCreate,
    MarketingCampaignUpdate,
)


class CRUDMarketingCampaign(CRUDBase[
    MarketingCampaign,
    MarketingCampaignCreate,
    MarketingCampaignUpdate
]):
    def get_by_creator(
        self,
        db: Session,
        *,
        creator_id: str,
        skip: int = 0,
        limit: int = 100
    ) -> List[MarketingCampaign]:
        """Get campaigns created by a specific user."""
        return (
            db.query(self.model)
            .filter(MarketingCampaign.creator_id == creator_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_active_campaigns(
        self,
        db: Session,
        *,
        skip: int = 0,
        limit: int = 100
    ) -> List[MarketingCampaign]:
        """Get all active marketing campaigns."""
        return (
            db.query(self.model)
            .filter(MarketingCampaign.status == "active")
            .offset(skip)
            .limit(limit)
            .all()
        )

    def update_metrics(
        self,
        db: Session,
        *,
        campaign_id: str,
        metrics: Dict[str, int]
    ) -> Optional[MarketingCampaign]:
        """Update campaign metrics."""
        campaign = self.get(db, id=campaign_id)
        if not campaign:
            return None
        
        current_metrics = campaign.metrics
        current_metrics.update(metrics)
        
        setattr(campaign, "metrics", current_metrics)
        db.commit()
        db.refresh(campaign)
        return campaign

    def get_campaign_stats(
        self,
        db: Session
    ) -> Dict[str, Any]:
        """Get overall campaign statistics."""
        total = db.query(self.model).count()
        active = (
            db.query(self.model)
            .filter(MarketingCampaign.status == "active")
            .count()
        )
        completed = (
            db.query(self.model)
            .filter(MarketingCampaign.status == "completed")
            .count()
        )
        
        return {
            "total": total,
            "active": active,
            "completed": completed,
            "draft": total - (active + completed)
        }

    def create(
        self,
        db: Session,
        *,
        obj_in: MarketingCampaignCreate,
        creator_id: str
    ) -> MarketingCampaign:
        """Create a new marketing campaign."""
        db_obj = MarketingCampaign(
            **obj_in.dict(),
            creator_id=creator_id
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


marketing_campaign = CRUDMarketingCampaign(MarketingCampaign)
