from fastapi import APIRouter

from app.api.v1.endpoints import (
    admin,
    auth,
    users,
    events,
    sponsors,
    banners,
)

api_router = APIRouter()
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
