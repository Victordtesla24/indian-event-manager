import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from fastapi.middleware.gzip import GZipMiddleware
from app.api.v1.api import api_router
from sqlalchemy import create_engine
from sqlalchemy.exc import SQLAlchemyError


ALLOWED_ORIGINS = [
    "http://localhost:3000",  # Local development
    "http://localhost:5175",  # Vite development
    "http://localhost:5176",  # Vite development alternate port
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
    version="1.0.0",
    default_response_class=JSONResponse
)

# Add GZip compression
app.add_middleware(GZipMiddleware, minimum_size=1000)


# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health check endpoint
@app.get("/health")
async def health_check():
    try:
        # Check database connection
        engine = create_engine(os.environ['DATABASE_URL'])
        with engine.connect() as connection:
            connection.execute("SELECT 1")

        # Check static directory
        if not os.path.exists("static"):
            return JSONResponse(
                status_code=503,
                content={
                    "status": "error",
                    "message": "Static directory not available",
                }
            )

        return {
            "status": "healthy",
            "database": "connected",
            "static_files": "available"
        }
    except SQLAlchemyError as e:
        return JSONResponse(
            status_code=503,
            content={
                "status": "error",
                "message": f"Database connection failed: {str(e)}",
            }
        )
    except Exception as e:
        return JSONResponse(
            status_code=503,
            content={
                "status": "error",
                "message": f"Service unhealthy: {str(e)}",
            }
        )


@app.get("/")
async def root():
    return {
        "message": "Welcome to Indian Event Manager API",
        "status": "active",
        "version": "1.0.0"
    }


# Mount static files with error handling
try:
    if not os.path.exists("static"):
        os.makedirs("static")
    app.mount("/static", StaticFiles(directory="static"), name="static")
except Exception as e:
    print(f"Warning: Failed to mount static files: {e}")


# Include API routers
app.include_router(api_router, prefix="/api/v1")


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={
            "status": "error",
            "message": str(exc),
            "path": request.url.path
        }
    )
