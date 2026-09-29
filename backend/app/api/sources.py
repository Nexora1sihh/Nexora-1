from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import Source
from ..schemas import SourceResponse

router = APIRouter(prefix="/sources", tags=["Sources"])

@router.get("", response_model=List[SourceResponse])
def get_sources(db: Session = Depends(get_db)):
    return db.query(Source).order_by(Source.trust_score.desc()).all()
