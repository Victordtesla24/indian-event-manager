import uuid
from typing import List, Optional, Dict
from sqlalchemy.orm import Session
from sqlalchemy import and_, func, desc

from app.crud.base import CRUDBase
from app.models.banner import Banner
from app.schemas.banner import BannerCreate, BannerUpdate


class CRUDBanner(CRUDBase[Banner, BannerCreate, BannerUpdate]):
    def create(self, db: Session, *, obj_in: BannerCreate) -> Banner:
        db_obj = Banner(
            id=str(uuid.uuid4()),
            sponsor_id=obj_in.sponsor_id,
            image_url=obj_in.image_url,
            link_url=obj_in.link_url,
            position=obj_in.position,
            is_active=obj_in.is_active,
            start_date=obj_in.start_date,
            end_date=obj_in.end_date,
            views_count=0,
            clicks_count=0,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_active_banners(
        self, db: Session, *, position: Optional[str] = None
    ) -> List[Banner]:
        query = db.query(self.model).filter(
            and_(
                self.model.is_active == True,  # noqa: E712
                self.model.start_date <= func.now(),
                self.model.end_date >= func.now(),
            )
        )
        if position:
            query = query.filter(self.model.position == position)
        return query.all()

    def get_sponsor_banners(
        self, db: Session, *, sponsor_id: str
    ) -> List[Banner]:
        return (
            db.query(self.model)
            .filter(self.model.sponsor_id == sponsor_id)
            .all()
        )

    def increment_views(self, db: Session, *, banner_id: str) -> Banner:
        banner = db.query(self.model).filter(
            self.model.id == banner_id
        ).first()
        if banner:
            banner.views_count += 1
            db.commit()
            db.refresh(banner)
        return banner

    def increment_clicks(self, db: Session, *, banner_id: str) -> Banner:
        banner = db.query(self.model).filter(
            self.model.id == banner_id
        ).first()
        if banner:
            banner.clicks_count += 1
            db.commit()
            db.refresh(banner)
        return banner

    def count(self, db: Session) -> int:
        return db.query(func.count(Banner.id)).scalar()

    def count_active(self, db: Session) -> int:
        return (
            db.query(func.count(Banner.id))
            .filter(
                and_(
                    Banner.is_active.is_(True),
                    Banner.start_date <= func.now(),
                    Banner.end_date >= func.now(),
                )
            )
            .scalar()
        )

    def count_by_sponsor(self, db: Session) -> Dict[str, int]:
        results = (
            db.query(Banner.sponsor_id, func.count(Banner.id))
            .group_by(Banner.sponsor_id)
            .all()
        )
        return {str(sponsor_id): count for sponsor_id, count in results}

    def get_top_performing(
        self,
        db: Session,
        *,
        limit: int = 5,
        by_metric: str = "clicks"
    ) -> List[Banner]:
        order_column = (
            Banner.clicks_count if by_metric == "clicks"
            else Banner.views_count
        )
        return (
            db.query(self.model)
            .order_by(desc(order_column))
            .limit(limit)
            .all()
        )


banner = CRUDBanner(Banner)
