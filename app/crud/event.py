from typing import List, Dict
from sqlalchemy import func
from datetime import datetime
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.event import Event
from app.schemas.event import EventCreate, EventUpdate
from app.models.event import EventStatus


class CRUDEvent(CRUDBase[Event, EventCreate, EventUpdate]):
    def create_with_organizer(
        self,
        db: Session,
        *,
        obj_in: EventCreate,
        organizer_id: str
    ) -> Event:
        obj_in_data = obj_in.model_dump()
        db_obj = Event(
            **obj_in_data,
            organizer_id=str(organizer_id)
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_multi_by_organizer(
        self,
        db: Session,
        *,
        organizer_id: str,
        skip: int = 0,
        limit: int = 100
    ) -> List[Event]:
        return (
            db.query(self.model)
            .filter(Event.organizer_id == organizer_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_multi_by_status(
        self,
        db: Session,
        *,
        status: EventStatus,
        skip: int = 0,
        limit: int = 100
    ) -> List[Event]:
        return (
            db.query(self.model)
            .filter(Event.status == status)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_multi_by_type(
        self,
        db: Session,
        *,
        event_type: str,
        skip: int = 0,
        limit: int = 100
    ) -> List[Event]:
        return (
            db.query(self.model)
            .filter(Event.event_type == event_type)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_upcoming_events(
        self,
        db: Session,
        *,
        skip: int = 0,
        limit: int = 100
    ) -> List[Event]:
        return (
            db.query(self.model)
            .filter(Event.event_date >= datetime.now())
            .filter(Event.status == EventStatus.APPROVED)
            .order_by(Event.event_date)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def count(self, db: Session) -> int:
        return db.query(func.count(Event.id)).scalar()

    def count_by_status(self, db: Session, *, status: str) -> int:
        return (
            db.query(func.count(Event.id))
            .filter(Event.status == status)
            .scalar()
        )

    def count_by_status_all(self, db: Session) -> Dict[str, int]:
        results = (
            db.query(Event.status, func.count(Event.id))
            .group_by(Event.status)
            .all()
        )
        return {status: count for status, count in results}

    def count_by_type(self, db: Session) -> Dict[str, int]:
        results = (
            db.query(Event.event_type, func.count(Event.id))
            .group_by(Event.event_type)
            .all()
        )
        return {event_type: count for event_type, count in results}

    def count_by_city(self, db: Session) -> Dict[str, int]:
        results = (
            db.query(Event.city, func.count(Event.id))
            .group_by(Event.city)
            .all()
        )
        return {city: count for city, count in results}

    def count_by_sponsor(self, db: Session) -> Dict[str, int]:
        results = (
            db.query(Event.organizer_id, func.count(Event.id))
            .filter(Event.organizer_id.isnot(None))
            .group_by(Event.organizer_id)
            .all()
        )
        return {str(organizer_id): count for organizer_id, count in results}

    def get_recent(self, db: Session, *, limit: int = 5) -> List[Event]:
        return (
            db.query(self.model)
            .order_by(Event.created_at.desc())
            .limit(limit)
            .all()
        )


event = CRUDEvent(Event)
