from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

app = FastAPI(
    title="Indian Event Manager",
    description="A cultural event platform for the Indian community in Melbourne and Sydney",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
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

# Import and include routers
from app.api.v1.api import api_router
app.include_router(api_router, prefix="/api/v1") 