from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel, EmailStr


# Shared properties
class SponsorBase(BaseModel):
    company_name: Optional[str] = None
    description: Optional[str] = None
    website: Optional[str] = None
    logo_url: Optional[str] = None
    banner_url: Optional[str] = None
    contact_email: Optional[EmailStr] = None
    contact_phone: Optional[str] = None


# Properties to receive on sponsor creation
class SponsorCreate(SponsorBase):
    company_name: str
    contact_email: EmailStr


# Properties to receive on sponsor update
class SponsorUpdate(SponsorBase):
    pass


# Properties shared by models stored in DB
class SponsorInDBBase(SponsorBase):
    id: str
    user_id: str
    company_name: str
    contact_email: EmailStr
    analytics: Dict[str, Any]
    total_views: int
    total_clicks: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Properties to return to client
class Sponsor(SponsorInDBBase):
    pass


# Properties stored in DB
class SponsorInDB(SponsorInDBBase):
    pass


# Properties for analytics
class SponsorAnalytics(BaseModel):
    total_views: int
    total_clicks: int
    analytics: Dict[str, Any]
