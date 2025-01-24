from typing import Optional, List
from pydantic import BaseModel, EmailStr
from enum import Enum


class UserRole(str, Enum):
    USER = "user"
    ADMIN = "admin"
    SPONSOR = "sponsor"


class AdminLevel(str, Enum):
    SUPER_ADMIN = "SUPER_ADMIN"
    ADMIN = "ADMIN"
    MODERATOR = "MODERATOR"


class AdminPermission(str, Enum):
    MANAGE_USERS = "MANAGE_USERS"
    MANAGE_EVENTS = "MANAGE_EVENTS"
    MANAGE_SPONSORS = "MANAGE_SPONSORS"
    MANAGE_CONTENT = "MANAGE_CONTENT"
    VIEW_ANALYTICS = "VIEW_ANALYTICS"
    MANAGE_SETTINGS = "MANAGE_SETTINGS"
    MANAGE_MARKETING = "MANAGE_MARKETING"


# Shared properties
class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = True
    is_superuser: bool = False
    full_name: Optional[str] = None
    role: UserRole = UserRole.USER
    admin_level: Optional[AdminLevel] = None
    permissions: Optional[List[AdminPermission]] = None

    class Config:
        """Pydantic v1 compatibility mode"""
        orm_mode = True
        validate_assignment = True
        use_enum_values = True
        allow_population_by_field_name = True


# Properties to receive via API on creation
class UserCreate(UserBase):
    email: EmailStr
    password: str

    def dict(self, *args, **kwargs):
        """Compatibility method for both v1 and v2"""
        if hasattr(self, 'model_dump'):
            return self.model_dump(*args, **kwargs)
        return super().dict(*args, **kwargs)


# Properties to receive via API on update
class UserUpdate(UserBase):
    password: Optional[str] = None


class UserInDBBase(UserBase):
    id: Optional[str] = None


# Additional properties to return via API
class User(UserInDBBase):
    pass


# Additional properties stored in DB
class UserInDB(UserInDBBase):
    hashed_password: str
