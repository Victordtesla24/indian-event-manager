from typing import Optional, List
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from app.core.enums import UserRole, AdminLevel, AdminPermission


# Shared properties
class UserBase(BaseModel):
    email: Optional[EmailStr] = None
    is_active: bool = Field(default=True)
    is_superuser: bool = Field(default=False)
    full_name: Optional[str] = None
    role: UserRole = Field(default=UserRole.USER)
    admin_level: Optional[AdminLevel] = None
    permissions: Optional[List[AdminPermission]] = None

    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True,
        use_enum_values=True
    )


# Properties to receive via API on creation
class UserCreate(UserBase):
    email: EmailStr
    password: str


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
