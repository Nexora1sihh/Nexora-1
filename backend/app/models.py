import datetime
import uuid
import json
from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, Text, JSON, ForeignKey
from .database import Base

def generate_report_id():
    now = datetime.datetime.utcnow()
    rand_part = str(uuid.uuid4().int)[:6]
    return f"NWIP-{now.year}-{rand_part}"

def generate_event_id():
    now = datetime.datetime.utcnow()
    rand_part = str(uuid.uuid4().int)[:4]
    return f"EVT-{now.year}-{rand_part}"

class Report(Base):
    __tablename__ = "reports"

    id = Column(String, primary_key=True, default=generate_report_id)
    source = Column(String, nullable=False)
    source_type = Column(String, nullable=False)  # Official, Government, Weather API, Citizen, Social Media Demo, News/Web, Unknown
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    description = Column(Text, nullable=False)
    event_category = Column(String, nullable=False)  # Rainfall, Flooding, Thunderstorm, Heatwave, Fog, Dust Storm, Strong Wind
    secondary_category = Column(String, nullable=True)
    city = Column(String, nullable=False)
    state = Column(String, nullable=False)
    district = Column(String, nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    hashtags = Column(Text, nullable=True)  # JSON or comma-separated
    verification_status = Column(String, default="Pending")  # Verified, Pending, Suspicious, Under Review, Rejected
    confidence_score = Column(Float, default=0.5)  # 0.0 to 1.0
    trust_score = Column(Float, default=0.5)        # 0.0 to 1.0
    explainable_confidence = Column(JSON, nullable=True) # Source credibility, cross-source agreement, location consistency, time consistency, media consistency
    image_url = Column(String, nullable=True)
    video_url = Column(String, nullable=True)
    is_duplicate = Column(Boolean, default=False)
    duplicate_of_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)

class Event(Base):
    __tablename__ = "events"

    id = Column(String, primary_key=True, default=generate_event_id)
    event_type = Column(String, nullable=False)
    severity = Column(String, default="Moderate")  # Low, Moderate, High, Severe, Extreme
    city = Column(String, nullable=False)
    state = Column(String, nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    start_time = Column(DateTime, default=datetime.datetime.utcnow)
    last_updated = Column(DateTime, default=datetime.datetime.utcnow)
    confidence = Column(Float, default=0.8)
    verification_status = Column(String, default="Verified")
    report_count = Column(Integer, default=1)
    summary = Column(Text, nullable=True)

class Source(Base):
    __tablename__ = "sources"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False, unique=True)
    source_type = Column(String, nullable=False)  # Official, Government, Weather API, Citizen, Social Media Demo, News/Web
    trust_score = Column(Float, default=0.7)
    is_verified = Column(Boolean, default=True)
    total_reports = Column(Integer, default=0)
    last_active = Column(DateTime, default=datetime.datetime.utcnow)

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    password_hash = Column(String, nullable=False)
    role = Column(String, default="Citizen")  # Citizen, Analyst, Admin
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
