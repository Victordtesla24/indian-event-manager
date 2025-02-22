from fastapi import APIRouter
from fastapi.responses import JSONResponse

from app.api.v1.endpoints import (
    admin,
    auth,
    users,
    events,
    sponsors,
    banners,
    marketing,
)

api_router = APIRouter()

@api_router.get("/health", tags=["health"])
async def health_check():
    return JSONResponse(content={"status": "healthy"})

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(events.router, prefix="/events", tags=["events"])
api_router.include_router(
    sponsors.router, prefix="/sponsors", tags=["sponsors"]
)
api_router.include_router(
    banners.router, prefix="/banners", tags=["banners"]
)
api_router.include_router(
    admin.router, prefix="/admin", tags=["admin"]
)
api_router.include_router(
    marketing.router, prefix="/marketing", tags=["marketing"]
)
