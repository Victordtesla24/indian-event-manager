import os
import uuid
from typing import Any, Dict
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from app.api import deps
from app.core.config import settings
from app.models.user import User

router = APIRouter()


@router.post("/image", response_model=Dict[str, str])
async def upload_image(
    file: UploadFile = File(...),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Upload an image file.
    """
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No filename provided"
        )

    content_type = file.content_type or ""
    if not content_type.startswith('image/'):
        raise HTTPException(
            status_code=400,
            detail="File must be an image"
        )

    # Create uploads directory if it doesn't exist
    os.makedirs(settings.UPLOADS_DIR, exist_ok=True)

    # Generate unique filename
    file_extension = os.path.splitext(file.filename)[1]
    filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(settings.UPLOADS_DIR, filename)

    try:
        # Save file
        contents = await file.read()
        with open(file_path, 'wb') as f:
            f.write(contents)

        # Return file URL
        return {
            "url": f"/static/uploads/{filename}"
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to upload file: {str(e)}"
        )
