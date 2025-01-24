import uuid
from typing import Any, Dict, Optional, Union, List
from datetime import datetime, timedelta

from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.security import get_password_hash, verify_password
from app.crud.base import CRUDBase
from app.models.user import User, UserRole
from app.schemas.user import UserCreate, UserUpdate


class CRUDUser(CRUDBase[User, UserCreate, UserUpdate]):
    def get_by_email(self, db: Session, *, email: str) -> Optional[User]:
        return db.query(User).filter(User.email == email).first()

    def create(self, db: Session, *, obj_in: UserCreate) -> User:
        print(f"Creating user with permissions: {obj_in.permissions}")
        print(f"Admin level: {obj_in.admin_level}")
        db_obj = User(
            id=str(uuid.uuid4()),
            email=obj_in.email,
            hashed_password=get_password_hash(obj_in.password),
            full_name=obj_in.full_name,
            is_superuser=obj_in.is_superuser,
            is_active=True,
            role=obj_in.role,
            admin_level=obj_in.admin_level,
            permissions=obj_in.permissions,
        )
        print(f"Created user object with permissions: {db_obj.permissions}")
        print(f"Created user object with admin level: {db_obj.admin_level}")
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(
        self,
        db: Session,
        *,
        db_obj: User,
        obj_in: Union[UserUpdate, Dict[str, Any]]
    ) -> User:
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.model_dump(exclude_unset=True)
        if update_data.get("password"):
            hashed_password = get_password_hash(update_data["password"])
            del update_data["password"]
            update_data["hashed_password"] = hashed_password
        return super().update(db, db_obj=db_obj, obj_in=update_data)

    def authenticate(
        self, db: Session, *, email: str, password: str
    ) -> Optional[User]:
        user = self.get_by_email(db, email=email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user

    def is_active(self, user: User) -> bool:
        return user.is_active

    def is_superuser(self, user: User) -> bool:
        return user.is_superuser

    def count(self, db: Session) -> int:
        return db.query(func.count(User.id)).scalar()

    def count_active(self, db: Session) -> int:
        return (
            db.query(func.count(User.id))
            .filter(User.is_active.is_(True))
            .scalar()
        )

    def count_by_role(self, db: Session) -> Dict[UserRole, int]:
        results = (
            db.query(User.role, func.count(User.id))
            .group_by(User.role)
            .all()
        )
        return {role: count for role, count in results}

    def count_active_since(
        self,
        db: Session,
        *,
        since: datetime
    ) -> int:
        return (
            db.query(func.count(User.id))
            .filter(User.last_active >= since)
            .scalar()
        )

    def get_users_by_login_count(
        self,
        db: Session,
        *,
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        results = (
            db.query(
                User.id,
                User.full_name,
                User.email,
                User.login_count
            )
            .order_by(User.login_count.desc())
            .limit(limit)
            .all()
        )
        return [
            {
                "id": str(r.id),
                "full_name": r.full_name,
                "email": r.email,
                "login_count": r.login_count
            }
            for r in results
        ]

    def get_most_active_users(
        self,
        db: Session,
        *,
        limit: int = 10,
        days: int = 30
    ) -> List[Dict[str, Any]]:
        since = datetime.now() - timedelta(days=days)
        results = (
            db.query(
                User.id,
                User.full_name,
                User.email,
                User.last_active,
                func.count(User.last_active).label('activity_count')
            )
            .filter(User.last_active >= since)
            .group_by(User.id)
            .order_by(func.count(User.last_active).desc())
            .limit(limit)
            .all()
        )
        return [
            {
                "id": str(r.id),
                "full_name": r.full_name,
                "email": r.email,
                "last_active": r.last_active,
                "activity_count": r.activity_count
            }
            for r in results
        ]

    def update_login_stats(
        self,
        db: Session,
        *,
        user_id: str
    ) -> None:
        """Update user's login statistics."""
        user = self.get(db, id=user_id)
        if user:
            user.last_login = datetime.now()
            user.last_active = datetime.now()
            user.login_count += 1
            db.commit()


user = CRUDUser(User)
