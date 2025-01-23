from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app import crud, models, schemas
from app.api import deps

router = APIRouter()


@router.get("/", response_model=List[schemas.Event])
def list_events(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve events.
    """
    events = crud.event.get_multi(db, skip=skip, limit=limit)
    return events


@router.post("/", response_model=schemas.Event)
def create_event(
    *,
    db: Session = Depends(deps.get_db),
    event_in: schemas.EventCreate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new event.
    """
    event = crud.event.create_with_organizer(
        db=db, obj_in=event_in, organizer_id=current_user.id
    )
    return event


@router.put("/{event_id}", response_model=schemas.Event)
def update_event(
    *,
    db: Session = Depends(deps.get_db),
    event_id: str,
    event_in: schemas.EventUpdate,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Update an event.
    """
    event = crud.event.get(db=db, id=event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    if event.organizer_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    event = crud.event.update(db=db, db_obj=event, obj_in=event_in)
    return event


@router.get("/{event_id}", response_model=schemas.Event)
def read_event(
    *,
    db: Session = Depends(deps.get_db),
    event_id: str,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get event by ID.
    """
    event = crud.event.get(db=db, id=event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    return event


@router.delete("/{event_id}", response_model=schemas.Event)
def delete_event(
    *,
    db: Session = Depends(deps.get_db),
    event_id: str,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Delete an event.
    """
    event = crud.event.get(db=db, id=event_id)
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
    if event.organizer_id != current_user.id and not current_user.is_superuser:
        raise HTTPException(status_code=400, detail="Not enough permissions")
    event = crud.event.remove(db=db, id=event_id)
    return event


@router.get("/type/{event_type}", response_model=List[schemas.Event])
def list_events_by_type(
    event_type: str,
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve events by type.
    """
    events = crud.event.get_multi_by_type(
        db=db, event_type=event_type, skip=skip, limit=limit
    )
    return events


@router.get("/upcoming/", response_model=List[schemas.Event])
def list_upcoming_events(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: models.User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve upcoming events.
    """
    events = crud.event.get_upcoming_events(db=db, skip=skip, limit=limit)
    return events 