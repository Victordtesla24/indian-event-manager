from datetime import datetime, timedelta
from typing import cast
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app import crud
from app.schemas.event import EventCreate
from app.schemas.user import UserCreate
from app.models.user import User
from app.models.event import Event


def test_create_event(
    client: TestClient, db: Session, superuser_token_headers: dict
) -> None:
    data = {
        "title": "Test Event",
        "description": "Test Description",
        "location": "Test Location",
        "city": "Test City",
        "event_date": (datetime.now() + timedelta(days=1)).isoformat(),
        "event_type": "Cultural"
    }

    # First create a test user and get their token
    test_organizer = crud.user.create(
        db,
        obj_in=UserCreate(
            email="test_organizer@example.com",  # type: ignore
            password="test123",
            full_name="Test Organizer",
            is_superuser=True
        )
    )
    # Help type checker understand the type
    test_organizer = cast(User, test_organizer)
    login_data = {
        "username": "test_organizer@example.com",
        "password": "test123"
    }
    login_response = client.post("/api/v1/auth/login", data=login_data)
    assert login_response.status_code == 200
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Create event with the test organizer
    data["organizer_id"] = str(test_organizer.id)
    response = client.post(
        "/api/v1/events/",
        headers=headers,
        json=data
    )
    assert response.status_code == 200
    content = response.json()
    assert content["title"] == data["title"]
    assert content["description"] == data["description"]
    assert content["location"] == data["location"]
    assert content["city"] == data["city"]
    assert content["event_type"] == data["event_type"]


def test_read_event(
    client: TestClient, db: Session, superuser_token_headers: dict
) -> None:
    # Create a test user first
    test_user = crud.user.create(
        db,
        obj_in=UserCreate(
            email="test_reader@example.com",  # type: ignore
            password="test123",
            full_name="Test Reader",
            is_superuser=True
        )
    )
    # Help type checker understand the type
    test_user = cast(User, test_user)

    event = cast(Event, crud.event.create_with_organizer(
        db=db,
        obj_in=EventCreate(
            title="Test Event 2",
            description="Test Description 2",
            location="Test Location 2",
            city="Test City 2",
            event_date=datetime.now() + timedelta(days=2),
            event_type="Religious"
        ),
        organizer_id=str(test_user.id)
    ))

    # Log in the test user and get their token
    login_data = {
        "username": "test_reader@example.com",
        "password": "test123"
    }
    login_response = client.post("/api/v1/auth/login", data=login_data)
    assert login_response.status_code == 200
    token = login_response.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    response = client.get(
        f"/api/v1/events/{str(event.id)}",
        headers=headers
    )
    assert response.status_code == 200
    content = response.json()
    assert content["title"] == event.title
    assert content["description"] == event.description
    assert content["location"] == event.location
    assert content["city"] == event.city
    assert content["event_type"] == event.event_type
