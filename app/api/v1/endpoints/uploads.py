from typing import Any
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from app import models
from app.api import deps
import os
from pathlib import Path
from PIL import Image
import io

router = APIRouter()

UPLOAD_DIR = Path("static/uploads")
ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
MAX_IMAGE_SIZE = 5 * 1024 * 1024  # 5MB


def create_upload_dir():
    """Create upload directory if it doesn't exist"""
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    for subdir in ["events", "sponsors", "banners"]:
        (UPLOAD_DIR / subdir).mkdir(exist_ok=True)


def validate_image(file: UploadFile) -> bool:
    """Validate image file type and size"""
    if not file.filename:
        return False
    
    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        return False
    
    return True


def optimize_image(
    image_data: bytes,
    max_size: tuple[int, int] = (800, 800)
) -> bytes:
    """Optimize image for web use"""
    img = Image.open(io.BytesIO(image_data))
    
    # Convert to RGB if necessary
    if img.mode in ('RGBA', 'P'):
        img = img.convert('RGB')
    
    # Resize if larger than max_size while maintaining aspect ratio
    width, height = img.size
    max_w, max_h = max_size
    if width > max_w or height > max_h:
        img.thumbnail(max_size)
    
    # Save optimized image
    output = io.BytesIO()
    img.save(output, format='JPEG', quality=85, optimize=True)
    return output.getvalue()


@router.post("/image/{category}")
async def upload_image(
    category: str,
    file: UploadFile = File(...),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Upload an image file.
    Category must be one of: events, sponsors, banners
    """
    if category not in ["events", "sponsors", "banners"]:
        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid category. Must be one of: events, sponsors, banners"
            )
        )
    
    if not validate_image(file):
        raise HTTPException(
            status_code=400,
            detail=(
                f"Invalid file type. Allowed types: {', '.join(ALLOWED_EXTENSIONS)}"
            )
        )
    
    try:
        create_upload_dir()
        
        # Read and validate file size
        contents = await file.read()
        if len(contents) > MAX_IMAGE_SIZE:
            raise HTTPException(
                status_code=400,
                detail=(
                    f"File too large. Maximum size: "
                    f"{MAX_IMAGE_SIZE/1024/1024}MB"
                )
            )
        
        # Optimize image
        optimized_image = optimize_image(contents)
        
        # Generate unique filename
        timestamp = int(
            os.path.getctime(file.filename)
            if os.path.exists(file.filename) else 0
        )
        filename = f"{timestamp}_{file.filename}"
        filepath = UPLOAD_DIR / category / filename
        
        # Save optimized image
        with open(filepath, "wb") as f:
            f.write(optimized_image)
        
        return {
            "filename": filename,
            "filepath": f"/static/uploads/{category}/{filename}",
            "size": len(optimized_image)
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error uploading file: {str(e)}"
        )


@router.delete("/image/{category}/{filename}")
async def delete_image(
    category: str,
    filename: str,
    current_user: models.User = Depends(deps.get_current_admin_user),
) -> Any:
    """
    Delete an uploaded image. Admin only.
    """
    if category not in ["events", "sponsors", "banners"]:
        raise HTTPException(
            status_code=400,
            detail="Invalid category"
        )
    
    filepath = UPLOAD_DIR / category / filename
    if not filepath.exists():
        raise HTTPException(
            status_code=404,
            detail="Image not found"
        )
    
    try:
        os.remove(filepath)
        return {"message": "Image deleted successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error deleting image: {str(e)}"
        )
