from datetime import datetime
from typing import Optional
from pydantic import BaseModel


# Shared properties
class EventBase(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None
    event_date: Optional[datetime] = None
    event_type: Optional[str] = None
    image_url: Optional[str] = None
    max_participants: Optional[int] = None
    price: Optional[float] = None
    is_featured: Optional[bool] = False


# Properties to receive on event creation
class EventCreate(EventBase):
    title: str
    description: str
    location: str
    event_date: datetime
    event_type: str


# Properties to receive on event update
class EventUpdate(EventBase):
    pass


# Properties shared by models stored in DB
class EventInDBBase(EventBase):
    id: str
    title: str
    description: str
    location: str
    event_date: datetime
    event_type: str
    organizer_id: str
    created_at: datetime
    updated_at: datetime
    is_approved: bool

    class Config:
        from_attributes = True


# Properties to return to client
class Event(EventInDBBase):
    pass


# Properties properties stored in DB
class EventInDB(EventInDBBase):
    pass 