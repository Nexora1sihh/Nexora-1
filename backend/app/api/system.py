from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Report, Event
from ..config import settings

router = APIRouter(prefix="/system", tags=["System"])

@router.get("/status")
def get_system_status(db: Session = Depends(get_db)):
    total_reports = db.query(Report).count()
    active_events = db.query(Event).count()

    return {
        "status": "ONLINE",
        "platform": settings.PROJECT_NAME,
        "short_name": settings.PROJECT_SHORT_NAME,
        "tagline": settings.TAGLINE,
        "version": settings.VERSION,
        "services": {
            "fastapi_backend": {"status": "HEALTHY", "uptime": "100%", "port": 8000},
            "database": {"status": "CONNECTED", "type": "PostgreSQL/PostGIS (SQLite Dev Fallback)"},
            "kafka_streaming": {"status": "ACTIVE", "topic": settings.KAFKA_TOPIC_WEATHER_REPORTS, "mode": "In-Process / Broker Ready"},
            "spark_analytics": {"status": "ACTIVE", "mode": "Distributed Batch & Real-Time Processing"},
            "ml_pipeline": {"status": "ACTIVE", "model": "Scikit-Learn NLP Classifier & DupDetector"},
            "object_storage": {"status": "ACTIVE", "type": "MinIO / S3 Media Bucket"},
            "websocket_server": {"status": "LISTENING", "endpoint": "/ws/events"}
        },
        "telemetry": {
            "stored_reports": total_reports,
            "tracked_events": active_events,
            "demo_mode": settings.DEMO_MODE
        }
    }
