from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app import crud
from app.core.config import settings
from app.schemas.user import UserCreate


def test_register_user(client: TestClient, db: Session) -> None:
    email = "test@example.com"
    password = "test123"
    data = {"email": email, "password": password}
    response = client.post("/api/v1/auth/register", json=data)
    assert response.status_code == 200
    assert response.json()["email"] == email
    user = crud.user.get_by_email(db, email=email)
    assert user is not None
    assert user.email == email


def test_login_user(client: TestClient, db: Session) -> None:
    email = "test2@example.com"
    password = "test123"
    user_in = UserCreate(email=email, password=password)
    crud.user.create(db, obj_in=user_in)
    data = {
        "username": email,
        "password": password,
    }
    response = client.post("/api/v1/auth/login", data=data)
    assert response.status_code == 200
    tokens = response.json()
    assert "access_token" in tokens
    assert tokens["access_token"] 