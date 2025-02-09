from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app import crud
from app.schemas.user import UserCreate
from app.core.enums import UserRole


def test_register_user(client: TestClient, db: Session) -> None:
    email = "newuser@example.com"
    password = "test123"
    user_in = UserCreate(
        email=email,
        password=password,
        is_superuser=False,
        full_name="Test User",
        role=UserRole.USER
    )
    response = client.post(
        "/api/v1/auth/register",
        json=user_in.model_dump(exclude_unset=True)
    )
    assert response.status_code == 200
    assert response.json()["email"] == email
    user = crud.user.get_by_email(db, email=email)
    assert user is not None
    assert user.email == email


def test_login_user(client: TestClient, db: Session) -> None:
    email = "test2@example.com"
    password = "test123"
    user_in = UserCreate(
        email=email,
        password=password,
        is_superuser=False,
        full_name="Test User 2",
        role=UserRole.USER
    )
    crud.user.create(db, obj_in=user_in)
    data = {
        "username": email,
        "password": password,
        "grant_type": "password"
    }
    headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    }
    response = client.post(
        "/api/v1/auth/login",
        data=data,
        headers=headers
    )
    assert response.status_code == 200
    tokens = response.json()
    assert "access_token" in tokens
    assert tokens["access_token"]
