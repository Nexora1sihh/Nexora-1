import datetime
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from ..database import get_db
from ..models import Report
from ..schemas import ReportResponse, ReportUpdateStatus
from ..ml.classifier import classify_weather_text
from ..ml.trust_scorer import calculate_trust_score
from ..ml.duplicate_detector import detect_duplicates
from ..websocket import manager

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("", response_model=List[ReportResponse])
def get_reports(
    date_filter: Optional[str] = Query(None, description="today, 24h, 7d, 30d"),
    event: Optional[str] = Query(None, description="Rainfall, Flooding, Thunderstorm, Heatwave, Fog, Dust Storm, Strong Wind"),
    state: Optional[str] = None,
    city: Optional[str] = None,
    verification: Optional[str] = Query(None, description="Verified, Pending, Suspicious, Under Review, Rejected"),
    search: Optional[str] = None,
    limit: int = 100,
    offset: int = 0,
    db: Session = Depends(get_db)
):
    query = db.query(Report)

    # Date Filtering
    now = datetime.datetime.utcnow()
    if date_filter == "today":
        today_start = datetime.datetime(now.year, now.month, now.day)
        query = query.filter(Report.timestamp >= today_start)
    elif date_filter == "24h":
        query = query.filter(Report.timestamp >= now - datetime.timedelta(hours=24))
    elif date_filter == "7d":
        query = query.filter(Report.timestamp >= now - datetime.timedelta(days=7))
    elif date_filter == "30d":
        query = query.filter(Report.timestamp >= now - datetime.timedelta(days=30))

    # Event Filtering
    if event and event != "All":
        if event == "Rainfall":
            query = query.filter(Report.event_category.in_(["Heavy Rainfall", "Rainfall"]))
        else:
            query = query.filter(Report.event_category == event)

    # Location Filtering
    if state and state != "All":
        query = query.filter(Report.state == state)
    if city and city != "All":
        query = query.filter(Report.city == city)

    # Verification Status Filtering
    if verification and verification != "All":
        query = query.filter(Report.verification_status == verification)

    # Global Search Filtering
    if search:
        search_term = f"%{search.strip()}%"
        query = query.filter(
            (Report.id.ilike(search_term)) |
            (Report.city.ilike(search_term)) |
            (Report.state.ilike(search_term)) |
            (Report.event_category.ilike(search_term)) |
            (Report.source.ilike(search_term)) |
            (Report.hashtags.ilike(search_term)) |
            (Report.description.ilike(search_term))
        )

    reports = query.order_by(Report.timestamp.desc()).offset(offset).limit(limit).all()
    return reports

@router.get("/{id}", response_model=ReportResponse)
def get_report_by_id(id: str, db: Session = Depends(get_db)):
    report = db.query(Report).filter(Report.id == id).first()
    if not report:
        raise HTTPException(status_code=404, detail=f"Report {id} not found")
    return report

@router.put("/{id}/verify", response_model=ReportResponse)
async def verify_report(id: str, update: Optional[ReportUpdateStatus] = None, db: Session = Depends(get_db)):
    report = db.query(Report).filter(Report.id == id).first()
    if not report:
        raise HTTPException(status_code=404, detail=f"Report {id} not found")
    
    report.verification_status = "Verified"
    report.confidence_score = 0.95
    if update and update.category:
        report.event_category = update.category
    if update and update.city:
        report.city = update.city
    if update and update.state:
        report.state = update.state

    report.updated_at = datetime.datetime.utcnow()
    db.commit()
    db.refresh(report)

    # Broadcast WebSocket update
    await manager.broadcast({
        "type": "REPORT_VERIFIED",
        "report_id": report.id,
        "status": "Verified",
        "city": report.city,
        "event_category": report.event_category
    })

    return report

@router.put("/{id}/reject", response_model=ReportResponse)
async def reject_report(id: str, db: Session = Depends(get_db)):
    report = db.query(Report).filter(Report.id == id).first()
    if not report:
        raise HTTPException(status_code=404, detail=f"Report {id} not found")
    
    report.verification_status = "Rejected"
    report.updated_at = datetime.datetime.utcnow()
    db.commit()
    db.refresh(report)

    await manager.broadcast({
        "type": "REPORT_REJECTED",
        "report_id": report.id,
        "status": "Rejected"
    })
    return report

@router.put("/{id}/suspicious", response_model=ReportResponse)
async def mark_suspicious(id: str, db: Session = Depends(get_db)):
    report = db.query(Report).filter(Report.id == id).first()
    if not report:
        raise HTTPException(status_code=404, detail=f"Report {id} not found")
    
    report.verification_status = "Suspicious"
    report.confidence_score = 0.25
    report.updated_at = datetime.datetime.utcnow()
    db.commit()
    db.refresh(report)

    await manager.broadcast({
        "type": "REPORT_SUSPICIOUS",
        "report_id": report.id,
        "status": "Suspicious"
    })
    return report
