import datetime
import random
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Report, generate_report_id
from ..schemas import ReportResponse
from ..ml.classifier import classify_weather_text
from ..ml.trust_scorer import calculate_trust_score
from ..ml.duplicate_detector import detect_duplicates
from ..websocket import manager
from ..seed_data import INDIAN_CITIES_COORDS

router = APIRouter(prefix="/demo", tags=["Demo Simulation"])

@router.post("/simulate-report", response_model=ReportResponse)
async def simulate_report(db: Session = Depends(get_db)):
    city, state, base_lat, base_lng = random.choice(INDIAN_CITIES_COORDS)
    categories = ["Heavy Rainfall", "Flooding", "Thunderstorm", "Heatwave", "Fog", "Dust Storm", "Strong Wind"]
    category = random.choice(categories)

    descs = {
        "Flooding": f"Severe urban waterlogging reported near central station in {city}. Water depth approx 1.5 feet.",
        "Heavy Rainfall": f"Torrential monsoon downpour recorded in {city}, {state}. Heavy showers ongoing.",
        "Thunderstorm": f"Intense thunderstorm with lightning strikes and high gust winds across {city}.",
        "Heatwave": f"Extreme heatwave warning in {city}. Ambient temperature crossed 44.5°C.",
        "Fog": f"Dense fog lowering highway visibility below 30m in {city} area.",
        "Dust Storm": f"Sudden dust storm (Andhi) sweeping through {city} with 50 km/h wind squall.",
        "Strong Wind": f"Gale winds uprooting billboard hoardings and tree branches in {city} district."
    }

    lat = base_lat + random.uniform(-0.08, 0.08)
    lng = base_lng + random.uniform(-0.08, 0.08)
    desc = descs[category]

    primary_cat, sec_cat, ml_conf = classify_weather_text(desc)
    
    rep_dict = {
        "source": f"@WeatherWatch_{random.randint(100, 999)}",
        "source_type": random.choice(["Social Media Demo", "Citizen", "News/Web"]),
        "description": desc,
        "event_category": primary_cat,
        "city": city,
        "state": state,
        "latitude": lat,
        "longitude": lng,
        "image_url": "https://images.unsplash.com/photo-1519692933481-e162a57d6721?w=800&q=80"
    }

    existing = db.query(Report).filter(Report.city == city).all()
    existing_list = [{"id": r.id, "source": r.source, "description": r.description, "event_category": r.event_category, "latitude": r.latitude, "longitude": r.longitude} for r in existing]

    dup_info = detect_duplicates(rep_dict, existing_list)
    trust_res = calculate_trust_score(rep_dict, existing_list)

    now = datetime.datetime.utcnow()
    report = Report(
        id=generate_report_id(),
        source=rep_dict["source"],
        source_type=rep_dict["source_type"],
        timestamp=now,
        description=desc,
        event_category=primary_cat,
        secondary_category=sec_cat,
        city=city,
        state=state,
        latitude=lat,
        longitude=lng,
        hashtags=f"#IMD,#WeatherAlert,#{category.replace(' ', '')},#{city}Weather",
        verification_status=trust_res["verification_status"],
        confidence_score=trust_res["confidence_score"],
        trust_score=trust_res["trust_score"],
        explainable_confidence=trust_res["explainable_confidence"],
        image_url=rep_dict["image_url"],
        is_duplicate=bool(dup_info),
        duplicate_of_id=dup_info["matched_report_id"] if dup_info else None,
        created_at=now,
        updated_at=now
    )

    db.add(report)
    db.commit()
    db.refresh(report)

    await manager.broadcast({
        "type": "NEW_REPORT",
        "report_id": report.id,
        "event_category": report.event_category,
        "city": report.city,
        "state": report.state,
        "latitude": report.latitude,
        "longitude": report.longitude,
        "verification_status": report.verification_status,
        "confidence_score": report.confidence_score,
        "description": report.description
    })

    return report

@router.post("/simulate-flood", response_model=ReportResponse)
async def simulate_flood(db: Session = Depends(get_db)):
    city, state, lat, lng = "Patna", "Bihar", 25.5941, 85.1376
    desc = "CRITICAL FLOOD ALERT: Ganges river water level crossed danger mark near Patna Gandhi Maidan. Low-lying areas inundated!"

    now = datetime.datetime.utcnow()
    report = Report(
        id=generate_report_id(),
        source="IMD_Emergency_Feed",
        source_type="Official",
        timestamp=now,
        description=desc,
        event_category="Flooding",
        secondary_category="Heavy Rainfall",
        city=city,
        state=state,
        latitude=lat + random.uniform(-0.02, 0.02),
        longitude=lng + random.uniform(-0.02, 0.02),
        hashtags="#IMD,#PatnaFlood,#FloodAlert,#BiharWeather",
        verification_status="Verified",
        confidence_score=0.96,
        trust_score=0.96,
        explainable_confidence={
            "source_credibility": 98.0,
            "cross_source_agreement": 95.0,
            "location_consistency": 98.0,
            "time_consistency": 96.0,
            "media_consistency": 90.0,
            "overall_confidence": 96.0
        },
        image_url="https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&q=80",
        created_at=now,
        updated_at=now
    )

    db.add(report)
    db.commit()
    db.refresh(report)

    await manager.broadcast({
        "type": "NEW_REPORT",
        "report_id": report.id,
        "event_category": report.event_category,
        "city": report.city,
        "state": report.state,
        "latitude": report.latitude,
        "longitude": report.longitude,
        "verification_status": report.verification_status,
        "confidence_score": report.confidence_score,
        "description": report.description
    })

    return report

@router.post("/simulate-storm", response_model=ReportResponse)
async def simulate_storm(db: Session = Depends(get_db)):
    city, state, lat, lng = "Delhi", "Delhi", 28.6139, 77.2090
    desc = "SEVERE THUNDERSTORM ALERT: High wind gusts (75 km/h) & lightning strikes reported across Central Delhi & Noida expressway."

    now = datetime.datetime.utcnow()
    report = Report(
        id=generate_report_id(),
        source="NDRF_Delhi_Control",
        source_type="Government",
        timestamp=now,
        description=desc,
        event_category="Thunderstorm",
        secondary_category="Strong Wind",
        city=city,
        state=state,
        latitude=lat + random.uniform(-0.03, 0.03),
        longitude=lng + random.uniform(-0.03, 0.03),
        hashtags="#IMD,#DelhiStorm,#WeatherAlert,#Thunderstorm",
        verification_status="Verified",
        confidence_score=0.94,
        trust_score=0.94,
        explainable_confidence={
            "source_credibility": 95.0,
            "cross_source_agreement": 92.0,
            "location_consistency": 96.0,
            "time_consistency": 94.0,
            "media_consistency": 88.0,
            "overall_confidence": 94.0
        },
        image_url="https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?w=800&q=80",
        created_at=now,
        updated_at=now
    )

    db.add(report)
    db.commit()
    db.refresh(report)

    await manager.broadcast({
        "type": "NEW_REPORT",
        "report_id": report.id,
        "event_category": report.event_category,
        "city": report.city,
        "state": report.state,
        "latitude": report.latitude,
        "longitude": report.longitude,
        "verification_status": report.verification_status,
        "confidence_score": report.confidence_score,
        "description": report.description
    })

    return report
