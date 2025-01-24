from typing import Dict, Generator, Any
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import StaticPool
from app.db.base import Base
from app.main import app
from app.api import deps
from app import crud
from app.schemas.user import UserCreate, UserRole


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
    with TestClient(app) as test_client:
        yield test_client

    # Cleanup
    app.dependency_overrides.clear()


def get_superuser_token_headers(client: TestClient) -> Dict[str, str]:
    """Helper function to get superuser token headers for testing."""
    # For testing purposes, we'll return an empty dict
    # In a real implementation, this would create a superuser and get token
    return {}


@pytest.fixture(scope="module")
def superuser_token_headers(client: TestClient) -> Dict[str, str]:
    """Fixture to get superuser token headers for testing."""
    return get_superuser_token_headers(client)
