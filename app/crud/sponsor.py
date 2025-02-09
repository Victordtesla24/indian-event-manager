from typing import List
from datetime import datetime
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.sponsor import Sponsor
from app.schemas.sponsor import SponsorCreate, SponsorUpdate


class CRUDSponsor(CRUDBase[Sponsor, SponsorCreate, SponsorUpdate]):
    def count(self, db: Session) -> int:
        """Get total count of sponsors"""
        return db.query(Sponsor).count()

    def count_by_date_range(
        self,
        db: Session,
        start_date: datetime,
        end_date: datetime
    ) -> int:
        """Get count of sponsors created within a date range"""
        return (
            db.query(Sponsor)
            .filter(Sponsor.created_at >= start_date)
            .filter(Sponsor.created_at <= end_date)
            .count()
        )

    def get_active_sponsors(
        self,
        db: Session,
        skip: int = 0,
        limit: int = 100
    ) -> List[Sponsor]:
        """Get active sponsors"""
        return (
            db.query(Sponsor)
            .filter(Sponsor.is_active.is_(True))
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_sponsors_by_event(
        self,
        db: Session,
        event_id: str,
        skip: int = 0,
        limit: int = 100
    ) -> List[Sponsor]:
        """Get sponsors for a specific event"""
        return (
            db.query(Sponsor)
            .join(Sponsor.events)
            .filter(Sponsor.events.any(id=event_id))
            .offset(skip)
            .limit(limit)
            .all()
        )


sponsor = CRUDSponsor(Sponsor)
