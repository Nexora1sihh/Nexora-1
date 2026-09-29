from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import Event
from ..schemas import EventResponse

router = APIRouter(prefix="/events", tags=["Events"])

@router.get("", response_model=List[EventResponse])
def get_events(
    event_type: Optional[str] = None,
    city: Optional[str] = None,
    state: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Event)
    if event_type and event_type != "All":
        query = query.filter(Event.event_type == event_type)
    if city and city != "All":
        query = query.filter(Event.city == city)
    if state and state != "All":
        query = query.filter(Event.state == state)

    return query.order_by(Event.last_updated.desc()).all()

@router.get("/{id}", response_model=EventResponse)
def get_event_by_id(id: str, db: Session = Depends(get_db)):
    evt = db.query(Event).filter(Event.id == id).first()
    if not evt:
        raise HTTPException(status_code=404, detail=f"Event {id} not found")
    return evt
