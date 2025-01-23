from datetime import datetime, timedelta
from fastapi.testclient import TestClient
from sqlalchemy.orm import Session
from app import crud
from app.schemas.event import EventCreate


def test_create_event(
    client: TestClient, db: Session, superuser_token_headers: dict
) -> None:
    data = {
        "title": "Test Event",
        "description": "Test Description",
        "location": "Test Location",
        "event_date": (datetime.now() + timedelta(days=1)).isoformat(),
        "event_type": "Cultural",
    }
    response = client.post(
        "/api/v1/events/",
        headers=superuser_token_headers,
        json=data,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["title"] == data["title"]
    assert content["description"] == data["description"]
    assert content["location"] == data["location"]
    assert content["event_type"] == data["event_type"]
    assert "id" in content
    assert "created_at" in content
    assert "updated_at" in content


def test_read_event(
    client: TestClient, db: Session, superuser_token_headers: dict
) -> None:
    event = crud.event.create_with_organizer(
        db=db,
        obj_in=EventCreate(
            title="Test Event 2",
            description="Test Description 2",
            location="Test Location 2",
            event_date=datetime.now() + timedelta(days=2),
            event_type="Religious",
        ),
        organizer_id=crud.user.get_by_email(
            db, email="admin@example.com"
        ).id,
    )
    response = client.get(
        f"/api/v1/events/{event.id}",
        headers=superuser_token_headers,
    )
    assert response.status_code == 200
    content = response.json()
    assert content["title"] == event.title
    assert content["description"] == event.description
    assert content["location"] == event.location
    assert content["event_type"] == event.event_type 