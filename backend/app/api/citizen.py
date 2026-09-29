import datetime
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Optional
from ..database import get_db
from ..models import Report, generate_report_id
from ..schemas import CitizenReportCreate, ReportResponse
from ..ml.classifier import classify_weather_text
from ..ml.trust_scorer import calculate_trust_score
from ..ml.duplicate_detector import detect_duplicates
from ..websocket import manager

router = APIRouter(tags=["Citizen Reporting"])

@router.post("/citizen-report", response_model=ReportResponse)
async def submit_citizen_report(
    report_in: CitizenReportCreate,
    db: Session = Depends(get_db)
):
    # 1. AI/ML Classification
    primary_cat, sec_cat, ml_conf = classify_weather_text(report_in.description)
    category = report_in.event_category if report_in.event_category and report_in.event_category != "Other" else primary_cat

    # 2. Check for Duplicate Reports
    existing = db.query(Report).filter(Report.city == report_in.city).all()
    existing_list = [{"id": r.id, "source": r.source, "description": r.description, "event_category": r.event_category, "latitude": r.latitude, "longitude": r.longitude} for r in existing]

    new_rep_dict = {
        "source": report_in.name or "Citizen_User",
        "source_type": "Citizen",
        "description": report_in.description,
        "event_category": category,
        "city": report_in.city,
        "state": report_in.state,
        "latitude": report_in.latitude,
        "longitude": report_in.longitude,
        "image_url": report_in.image_url,
        "video_url": report_in.video_url
    }

    dup_info = detect_duplicates(new_rep_dict, existing_list)
    trust_res = calculate_trust_score(new_rep_dict, existing_list)

    hashtags = report_in.hashtags or f"#IMD,#CitizenReport,#{category.replace(' ', '')},#{report_in.city}Weather"

    # 3. Create Report in DB
    report_id = generate_report_id()
    now = datetime.datetime.utcnow()

    db_report = Report(
        id=report_id,
        source=report_in.name or f"Citizen_{report_id[-4:]}",
        source_type="Citizen",
        timestamp=now,
        description=report_in.description,
        event_category=category,
        secondary_category=sec_cat,
        city=report_in.city,
        state=report_in.state,
        latitude=report_in.latitude,
        longitude=report_in.longitude,
        hashtags=hashtags,
        verification_status=trust_res["verification_status"],
        confidence_score=trust_res["confidence_score"],
        trust_score=trust_res["trust_score"],
        explainable_confidence=trust_res["explainable_confidence"],
        image_url=report_in.image_url,
        video_url=report_in.video_url,
        is_duplicate=bool(dup_info),
        duplicate_of_id=dup_info["matched_report_id"] if dup_info else None,
        created_at=now,
        updated_at=now
    )

    db.add(db_report)
    db.commit()
    db.refresh(db_report)

    # 4. Broadcast Real-Time WebSocket Event
    await manager.broadcast({
        "type": "NEW_REPORT",
        "report_id": db_report.id,
        "event_category": db_report.event_category,
        "city": db_report.city,
        "state": db_report.state,
        "latitude": db_report.latitude,
        "longitude": db_report.longitude,
        "verification_status": db_report.verification_status,
        "confidence_score": db_report.confidence_score
    })

    return db_report
