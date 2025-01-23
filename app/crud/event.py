from typing import List, Optional
from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session
from app.crud.base import CRUDBase
from app.models.event import Event
from app.schemas.event import EventCreate, EventUpdate


class CRUDEvent(CRUDBase[Event, EventCreate, EventUpdate]):
    def create_with_organizer(
        self, db: Session, *, obj_in: EventCreate, organizer_id: str
    ) -> Event:
        obj_in_data = jsonable_encoder(obj_in)
        db_obj = self.model(**obj_in_data, organizer_id=organizer_id)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def get_multi_by_organizer(
        self, db: Session, *, organizer_id: str, skip: int = 0, limit: int = 100
    ) -> List[Event]:
        return (
            db.query(self.model)
            .filter(Event.organizer_id == organizer_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_multi_by_type(
        self, db: Session, *, event_type: str, skip: int = 0, limit: int = 100
    ) -> List[Event]:
        return (
            db.query(self.model)
            .filter(Event.event_type == event_type)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_upcoming_events(
        self, db: Session, *, skip: int = 0, limit: int = 100
    ) -> List[Event]:
        from datetime import datetime
        return (
            db.query(self.model)
            .filter(Event.event_date >= datetime.now())
            .order_by(Event.event_date)
            .offset(skip)
            .limit(limit)
            .all()
        )


event = CRUDEvent(Event) 