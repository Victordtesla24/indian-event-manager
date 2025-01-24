from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class BannerBase(BaseModel):
    image_url: str
    link_url: str
    position: str
    is_active: bool = True
    start_date: datetime
    end_date: datetime


class BannerCreate(BannerBase):
    sponsor_id: str


class BannerUpdate(BaseModel):
    image_url: Optional[str] = None
    link_url: Optional[str] = None
    position: Optional[str] = None
    is_active: Optional[bool] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None


class Banner(BannerBase):
    id: str
    sponsor_id: str
    views_count: int
    clicks_count: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True
