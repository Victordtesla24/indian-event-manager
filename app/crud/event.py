from typing import Dict, Optional, List
from datetime import datetime, date
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.crud.base import CRUDBase
from app.models.event import Event
from app.schemas.event import EventCreate, EventUpdate


class CRUDEvent(CRUDBase[Event, EventCreate, EventUpdate]):
    def create_with_organizer(
        self, db: Session, *, obj_in: EventCreate, organizer_id: str
    ) -> Event:
        db_obj = Event(
            title=obj_in.title,
            description=obj_in.description,
            location=obj_in.location,
            city=obj_in.city,
            event_date=obj_in.event_date,
            event_type=obj_in.event_type,
            image_url=obj_in.image_url,
            organizer_id=organizer_id,
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def count(self, db: Session) -> int:
        """Get total count of events"""
        return db.query(Event).count()

    def count_by_date_range(
        self,
        db: Session,
        start_date: datetime,
        end_date: datetime
    ) -> int:
        """Get count of events within a date range"""
        return (
            db.query(Event)
            .filter(Event.event_date >= start_date)
            .filter(Event.event_date <= end_date)
            .count()
        )

    def get_daily_counts(
        self,
        db: Session,
        start_date: datetime,
        end_date: datetime
    ) -> Dict[date, int]:
        """Get daily event counts within a date range"""
        results = (
            db.query(
                func.date(Event.event_date).label('date'),
                func.count().label('count')
            )
            .filter(Event.event_date >= start_date)
            .filter(Event.event_date <= end_date)
            .group_by(func.date(Event.event_date))
            .all()
        )
        
        return {row.date: row.count for row in results}

    def get_upcoming_events(
        self,
        db: Session,
        skip: int = 0,
        limit: int = 100
    ) -> List[Event]:
        """Get upcoming events"""
        return (
            db.query(Event)
            .filter(Event.event_date >= datetime.now())
            .order_by(Event.event_date)
            .offset(skip)
            .limit(limit)
            .all()
        )


event = CRUDEvent(Event)
