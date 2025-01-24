from sqlalchemy.orm import Session
from app import crud, schemas
from app.db import base  # noqa: F401
from app.models.user import UserRole, AdminLevel, AdminPermission
import logging

logger = logging.getLogger(__name__)


# Make sure all SQL Alchemy models are imported before initializing DB
# Otherwise, SQL Alchemy might fail to initialize relationships


def init_db(db: Session) -> None:
    # Tables should be created with Alembic migrations
    # But if you don't want to use migrations, create
    # the tables un-commenting the next line
    # Base.metadata.create_all(bind=engine)

    # Create admin superuser
    admin = crud.user.get_by_email(db, email="admin@example.com")
    if not admin:
        admin_in = schemas.UserCreate(
            email="admin@example.com",
            password="admin123",
            is_superuser=True,
            full_name="Admin User",
            role=UserRole.ADMIN,
            admin_level=AdminLevel.SUPER_ADMIN,
            permissions=[perm for perm in AdminPermission]
        )
        admin = crud.user.create(db, obj_in=admin_in)
        logger.info("Created admin superuser")

    # Create standard user
    user = crud.user.get_by_email(db, email="user@example.com")
    if not user:
        user_in = schemas.UserCreate(
            email="user@example.com",
            password="user123",
            is_superuser=False,
            full_name="Standard User",
            role=UserRole.USER
        )
        user = crud.user.create(db, obj_in=user_in)
        logger.info("Created standard user")

    # Create sponsor user
    sponsor = crud.user.get_by_email(db, email="sponsor@example.com")
    if not sponsor:
        sponsor_in = schemas.UserCreate(
            email="sponsor@example.com",
            password="sponsor123",
            is_superuser=False,
            full_name="Sponsor User",
            role=UserRole.SPONSOR
        )
        sponsor = crud.user.create(db, obj_in=sponsor_in)
        logger.info("Created sponsor user")
