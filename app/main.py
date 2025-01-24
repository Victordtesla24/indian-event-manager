from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.api.v1.api import api_router


ALLOWED_ORIGINS = [
    "http://localhost:3000",  # Local development
    # Production frontends
    "https://indian-event-manager-6g6m331f4-vics-projects-31447d42.vercel.app",
    "https://indian-event-manager.vercel.app"
]

app = FastAPI(
    title="Indian Event Manager",
    description=(
        "A cultural event platform for the Indian community "
        "in Melbourne and Sydney"
    ),
    version="1.0.0"
)


# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/")
async def root():
    return {
        "message": "Welcome to Indian Event Manager API",
        "status": "active",
        "version": "1.0.0"
    }


# Include API routers
app.include_router(api_router, prefix="/api/v1")
