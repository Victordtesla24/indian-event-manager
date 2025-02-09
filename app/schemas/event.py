from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict


class EventBase(BaseModel):
    title: str
    description: str
    location: str
    city: str
    event_date: datetime
    event_type: str
    image_url: Optional[str] = None


class EventCreate(EventBase):
    pass


class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    city: Optional[str] = None
    event_date: Optional[datetime] = None
    event_type: Optional[str] = None
    image_url: Optional[str] = None
    status: Optional[str] = None


class EventInDBBase(EventBase):
    id: str
    status: str
    organizer_id: str

    model_config = ConfigDict(from_attributes=True)


class Event(EventInDBBase):
    pass


class EventInDB(EventInDBBase):
    pass
