from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel


class MarketingCampaignBase(BaseModel):
    title: str
    description: str
    start_date: datetime
    end_date: datetime
    type: str  # email, social, push, ai_generated
    target_audience: List[str]
    status: str = "draft"  # draft, active, completed


class MarketingCampaignCreate(MarketingCampaignBase):
    pass


class MarketingCampaignUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    type: Optional[str] = None
    target_audience: Optional[List[str]] = None
    status: Optional[str] = None


class MarketingCampaignMetrics(BaseModel):
    reach: int = 0
    engagement: int = 0
    conversions: int = 0


class MarketingCampaign(MarketingCampaignBase):
    id: str
    creator_id: str
    created_at: datetime
    updated_at: datetime
    metrics: MarketingCampaignMetrics

    class Config:
        orm_mode = True


class MarketingCampaignList(BaseModel):
    items: List[MarketingCampaign]
    total: int
