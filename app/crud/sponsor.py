from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.sponsor import Sponsor
from app.schemas.sponsor import SponsorCreate, SponsorUpdate


class CRUDSponsor(CRUDBase[Sponsor, SponsorCreate, SponsorUpdate]):
    def get_by_user_id(
        self, db: Session, *, user_id: str
    ) -> Optional[Sponsor]:
        return db.query(self.model).filter(Sponsor.user_id == user_id).first()

    def get_multi_by_ids(
        self,
        db: Session,
        *,
        sponsor_ids: List[str],
        skip: int = 0,
        limit: int = 100
    ) -> List[Sponsor]:
        return (
            db.query(self.model)
            .filter(Sponsor.id.in_(sponsor_ids))
            .offset(skip)
            .limit(limit)
            .all()
        )

    def update_analytics(
        self,
        db: Session,
        *,
        db_obj: Sponsor,
        analytics_data: Dict[str, Any]
    ) -> Sponsor:
        current_analytics = db_obj.analytics or {}
        current_analytics.update(analytics_data)
        
        db_obj.analytics = current_analytics
        db_obj.total_views = analytics_data.get(
            'total_views', db_obj.total_views
        )
        db_obj.total_clicks = analytics_data.get(
            'total_clicks', db_obj.total_clicks
        )
        
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def increment_views(
        self, db: Session, *, sponsor_id: str
    ) -> Optional[Sponsor]:
        sponsor = self.get(db, id=sponsor_id)
        if sponsor:
            sponsor.total_views += 1
            db.add(sponsor)
            db.commit()
            db.refresh(sponsor)
        return sponsor

    def increment_clicks(
        self, db: Session, *, sponsor_id: str
    ) -> Optional[Sponsor]:
        sponsor = self.get(db, id=sponsor_id)
        if sponsor:
            sponsor.total_clicks += 1
            db.add(sponsor)
            db.commit()
            db.refresh(sponsor)
        return sponsor


sponsor = CRUDSponsor(Sponsor)
