import datetime
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Dict, Any, List
from ..database import get_db
from ..models import Report, Event, Source
from ..schemas import AnalyticsSummary

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/summary", response_model=AnalyticsSummary)
def get_analytics_summary(db: Session = Depends(get_db)):
    now = datetime.datetime.utcnow()
    last_24h = now - datetime.timedelta(hours=24)

    total_reports = db.query(Report).count()
    verified_reports = db.query(Report).filter(Report.verification_status == "Verified").count()
    pending_reports = db.query(Report).filter(Report.verification_status == "Pending").count()
    suspicious_reports = db.query(Report).filter(Report.verification_status == "Suspicious").count()
    rejected_reports = db.query(Report).filter(Report.verification_status == "Rejected").count()
    under_review_reports = db.query(Report).filter(Report.verification_status == "Under Review").count()
    active_events = db.query(Event).filter(Event.verification_status == "Verified").count()
    last_24h_reports = db.query(Report).filter(Report.timestamp >= last_24h).count()

    return {
        "total_reports": total_reports,
        "verified_reports": verified_reports,
        "pending_reports": pending_reports,
        "suspicious_reports": suspicious_reports,
        "rejected_reports": rejected_reports,
        "under_review_reports": under_review_reports,
        "active_events": active_events,
        "last_24h_reports": last_24h_reports
    }

@router.get("/timeline")
def get_timeline_analytics(db: Session = Depends(get_db)):
    # Group reports by date
    results = db.query(
        func.date(Report.timestamp).label("date"),
        func.count(Report.id).label("count")
    ).group_by(func.date(Report.timestamp)).order_by(func.date(Report.timestamp)).all()

    return [{"date": str(r.date), "count": r.count} for r in results]

@router.get("/events")
def get_events_analytics(db: Session = Depends(get_db)):
    results = db.query(
        Report.event_category,
        func.count(Report.id).label("count")
    ).group_by(Report.event_category).order_by(func.count(Report.id).desc()).all()

    return [{"category": r.event_category, "count": r.count} for r in results]

@router.get("/locations")
def get_location_analytics(db: Session = Depends(get_db)):
    by_state = db.query(
        Report.state,
        func.count(Report.id).label("count")
    ).group_by(Report.state).order_by(func.count(Report.id).desc()).limit(10).all()

    by_city = db.query(
        Report.city,
        func.count(Report.id).label("count")
    ).group_by(Report.city).order_by(func.count(Report.id).desc()).limit(10).all()

    return {
        "by_state": [{"state": r.state, "count": r.count} for r in by_state],
        "by_city": [{"city": r.city, "count": r.count} for r in by_city]
    }

@router.get("/sources")
def get_sources_distribution(db: Session = Depends(get_db)):
    results = db.query(
        Report.source_type,
        func.count(Report.id).label("count")
    ).group_by(Report.source_type).order_by(func.count(Report.id).desc()).all()

    return [{"source_type": r.source_type, "count": r.count} for r in results]
