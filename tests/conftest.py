from typing import Dict, Generator, Any
import os
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool
from app.db.base import Base
from app.main import app
from app.api import deps
from app import crud
from app.schemas.user import UserCreate
from app.core.enums import UserRole, AdminLevel, AdminPermission

# Set test environment
os.environ["ENV_FILE"] = ".env.test"


# Use an in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool  # Use StaticPool for in-memory SQLite
)
TestingSessionLocal = sessionmaker(
    bind=engine,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False  # Prevent expired objects after commit
)


def init_test_db(db: Session) -> None:
    """Initialize test database with required test data."""
    # Create admin user
    admin = crud.user.get_by_email(db, email="admin@example.com")
    if not admin:
        admin_in = UserCreate(
            email="admin@example.com",
            password="admin123",
            is_superuser=True,
            full_name="Admin User",
            role=UserRole.ADMIN,
            admin_level=AdminLevel.SUPER_ADMIN,
            permissions=[perm for perm in AdminPermission]
        )
        crud.user.create(db, obj_in=admin_in)

    # Create test user
    user = crud.user.get_by_email(db, email="test@example.com")
    if not user:
        user_in = UserCreate(
            email="test@example.com",
            password="test123",
            is_superuser=False,
            full_name="Test User",
            role=UserRole.USER
        )
        crud.user.create(db, obj_in=user_in)


@pytest.fixture(scope="session")
def db() -> Generator[Session, Any, None]:
    """Create a fresh database for each test session."""
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        init_test_db(session)
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="module")
def client(db: Session) -> Generator[TestClient, Any, None]:
    """Create a test client using the test database."""
    def override_get_db():
        try:
            yield db
        finally:
            db.rollback()  # Rollback any pending changes

    app.dependency_overrides[deps.get_db] = override_get_db

    # Create test client
    client = TestClient(app)
    try:
        yield client
    finally:
        # Cleanup
        app.dependency_overrides.clear()


def get_superuser_token_headers(client: TestClient) -> Dict[str, str]:
    """Helper function to get superuser token headers for testing."""
    login_data = {
        "username": "admin@example.com",
        "password": "admin123",
        "grant_type": "password"
    }
    headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }
    response = client.post(
        "/api/v1/auth/login",
        data=login_data,
        headers=headers
    )
    tokens = response.json()
    return {"Authorization": f"Bearer {tokens['access_token']}"}


@pytest.fixture(scope="module")
def superuser_token_headers(client: TestClient) -> Dict[str, str]:
    """Fixture to get superuser token headers for testing."""
    return get_superuser_token_headers(client)
