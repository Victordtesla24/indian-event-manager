from typing import Generator, Optional
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from pydantic import ValidationError
from sqlalchemy.orm import Session

from app import crud, models, schemas
from app.core import security
from app.core.config import settings
from app.db.session import SessionLocal
from app.models.user import AdminPermission

reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login"
)


def get_db() -> Generator:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()


def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(reusable_oauth2)
) -> models.User:
    """Get current user from token."""
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[security.ALGORITHM]
        )
        token_data = schemas.TokenPayload(**payload)
    except (jwt.JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
    if not token_data.sub:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid token subject",
        )
    user = crud.user.get(db, id=str(token_data.sub))
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    if not crud.user.is_active(user):
        raise HTTPException(
            status_code=400,
            detail="Inactive user"
        )
    return user


def get_current_active_user(
    current_user: models.User = Depends(get_current_user),
) -> models.User:
    if not crud.user.is_active(current_user):
        raise HTTPException(
            status_code=400,
            detail="Inactive user"
        )
    return current_user


def get_current_admin_user(
    current_user: models.User = Depends(get_current_user),
) -> models.User:
    if not current_user.is_admin:
        raise HTTPException(
            status_code=403,
            detail="The user doesn't have enough privileges"
        )
    return current_user


def get_current_super_admin(
    current_user: models.User = Depends(get_current_user),
) -> models.User:
    if not current_user.is_super_admin:
        raise HTTPException(
            status_code=403,
            detail="Only super admins can perform this action"
        )
    return current_user


def check_permission(permission: AdminPermission):
    def permission_checker(
        current_user: models.User = Depends(get_current_admin_user)
    ) -> models.User:
        if not current_user.has_permission(permission):
            raise HTTPException(
                status_code=403,
                detail=f"User lacks required permission: {permission}"
            )
        return current_user
    return permission_checker


def get_current_sponsor_user(
    current_user: models.User = Depends(get_current_user),
) -> models.User:
    """Check if user is a sponsor."""
    if current_user.role != models.user.UserRole.SPONSOR:
        raise HTTPException(
            status_code=403,
            detail="User is not a sponsor"
        )
    return current_user


def update_user_activity(
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(get_current_user),
    request: Optional[Request] = None
) -> None:
    """Update user's last active timestamp."""
    if current_user and current_user.id:
        crud.user.update_login_stats(db, user_id=str(current_user.id))
