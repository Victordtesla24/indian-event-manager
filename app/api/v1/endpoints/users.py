from typing import Any, List, Dict
from fastapi import APIRouter, Body, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from pydantic import EmailStr
from sqlalchemy.orm import Session
from app import crud, models, schemas
from app.api import deps
from app.core.config import settings
from app.models.user import UserRole, AdminPermission

router = APIRouter()

# Permission dependencies
require_user_management = deps.check_permission(AdminPermission.MANAGE_USERS)


@router.get("/", response_model=List[schemas.User])
def read_users(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(require_user_management),
) -> Any:
    """
    Retrieve users.
    """
    users = crud.user.get_multi(db, skip=skip, limit=limit)
    return users


@router.post("/", response_model=schemas.User)
def create_user(
    *,
    db: Session = Depends(deps.get_db),
    user_in: schemas.UserCreate,
    current_user: models.User = Depends(require_user_management),
) -> Any:
    """
    Create new user.
    """
    user = crud.user.get_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system.",
        )
    user = crud.user.create(db, obj_in=user_in)
    return user


@router.patch("/{user_id}/role", response_model=schemas.User)
def update_user_role(
    *,
    db: Session = Depends(deps.get_db),
    user_id: str,
    role: UserRole = Body(..., embed=True),
    current_user: models.User = Depends(require_user_management),
) -> Any:
    """
    Update user role.
    """
    user = crud.user.get(db, id=user_id)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )
    
    user_in = schemas.UserUpdate(role=role)
    user = crud.user.update(db, db_obj=user, obj_in=user_in)
    return user


@router.patch("/{user_id}/status", response_model=schemas.User)
def update_user_status(
    *,
    db: Session = Depends(deps.get_db),
    user_id: str,
    is_active: bool = Body(..., embed=True),
    current_user: models.User = Depends(require_user_management),
) -> Any:
    """
    Activate or deactivate user.
    """
    user = crud.user.get(db, id=user_id)
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )
    
    user_in = schemas.UserUpdate(is_active=is_active)
    user = crud.user.update(db, db_obj=user, obj_in=user_in)
    return user


@router.get("/stats/overview", response_model=Dict)
def get_user_stats(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(require_user_management),
) -> Any:
    """
    Get user statistics.
    """
    total_users = crud.user.count(db)
    active_users = crud.user.count_active(db)
    users_by_role = crud.user.count_by_role(db)
    
    return {
        "total_users": total_users,
        "active_users": active_users,
        "users_by_role": {
            "user": users_by_role.get(UserRole.USER, 0),
            "admin": users_by_role.get(UserRole.ADMIN, 0),
            "sponsor": users_by_role.get(UserRole.SPONSOR, 0),
        }
    }


@router.put("/me", response_model=schemas.User)
def update_user_me(
    *,
    db: Session = Depends(deps.get_db),
    password: str = Body(None),
    full_name: str = Body(None),
    email: EmailStr = Body(None),
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update own user.
    """
    current_user_data = jsonable_encoder(current_user)
    user_in = schemas.UserUpdate(**current_user_data)
    if password is not None:
        user_in.password = password
    if full_name is not None:
        user_in.full_name = full_name
    if email is not None:
        user_in.email = email
    user = crud.user.update(db, db_obj=current_user, obj_in=user_in)
    return user


@router.get("/me", response_model=schemas.User)
def read_user_me(
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get current user.
    """
    return current_user


@router.get("/{user_id}", response_model=schemas.User)
def read_user_by_id(
    user_id: str,
    current_user: models.User = Depends(deps.get_current_active_user),
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Get a specific user by id.
    """
    user = crud.user.get(db, id=user_id)
    if user == current_user:
        return user
    if not current_user.has_permission(AdminPermission.MANAGE_USERS):
        raise HTTPException(
            status_code=403,
            detail="The user doesn't have permission to view other users"
        )
    return user
