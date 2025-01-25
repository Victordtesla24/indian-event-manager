from typing import Optional, List
from datetime import datetime, timedelta
import uuid
from sqlalchemy.orm import Session
from fastapi.encoders import jsonable_encoder
from app.crud.base import CRUDBase
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import get_password_hash, verify_password


class CRUDUser(CRUDBase[User, UserCreate, UserUpdate]):
    def create(self, db: Session, *, obj_in: UserCreate) -> User:
        obj_in_data = jsonable_encoder(obj_in)
        if "password" in obj_in_data:
            hashed_password = get_password_hash(obj_in_data["password"])
            del obj_in_data["password"]
            obj_in_data["hashed_password"] = hashed_password
        obj_in_data["id"] = str(uuid.uuid4())
        db_obj = User(**obj_in_data)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def authenticate(
        self, db: Session, *, username: str, password: str
    ) -> Optional[User]:
        # Try username (admin) login first
        if username == "admin":
            user = (
                db.query(User)
                .filter(User.email == "admin@example.com")
                .first()
            )
            if user and verify_password(password, user.hashed_password):
                return user
            return None
        
        # Fallback to email login
        user = self.get_by_email(db, email=username)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user

    def is_active(self, user: User) -> bool:
        """Check if user is active."""
        return user.is_active

    def get_by_email(self, db: Session, *, email: str) -> Optional[User]:
        return db.query(User).filter(User.email == email).first()

    def count_active(self, db: Session) -> int:
        """Get count of active users who logged in within 30 days."""
        thirty_days_ago = datetime.now() - timedelta(days=30)
        return (
            db.query(User)
            .filter(User.last_login >= thirty_days_ago)
            .count()
        )

    def count_active_by_date_range(
        self,
        db: Session,
        start_date: datetime,
        end_date: datetime
    ) -> int:
        """Get count of users who were active within a date range."""
        return (
            db.query(User)
            .filter(User.last_login >= start_date)
            .filter(User.last_login <= end_date)
            .count()
        )

    def get_multi_by_role(
        self,
        db: Session,
        *,
        role: str,
        skip: int = 0,
        limit: int = 100
    ) -> List[User]:
        """Get users by role"""
        return (
            db.query(User)
            .filter(User.role == role)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def update_last_login(
        self,
        db: Session,
        *,
        db_obj: User
    ) -> User:
        """Update user's last login timestamp"""
        db_obj.last_login = datetime.now()
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj


user = CRUDUser(User)
