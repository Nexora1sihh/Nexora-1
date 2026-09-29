from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class ReportBase(BaseModel):
    source: str
    source_type: str
    description: str
    event_category: str
    secondary_category: Optional[str] = None
    city: str
    state: str
    district: Optional[str] = None
    latitude: float
    longitude: float
    hashtags: Optional[str] = None
    image_url: Optional[str] = None
    video_url: Optional[str] = None

class CitizenReportCreate(BaseModel):
    name: Optional[str] = "Anonymous Citizen"
    description: str
    event_category: str
    city: str
    state: str
    latitude: float
    longitude: float
    hashtags: Optional[str] = None
    contact_info: Optional[str] = None
    image_url: Optional[str] = None
    video_url: Optional[str] = None

class ReportUpdateStatus(BaseModel):
    status: str  # Verified, Pending, Suspicious, Under Review, Rejected
    category: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    notes: Optional[str] = None

class ConfidenceBreakdown(BaseModel):
    source_credibility: float
    cross_source_agreement: float
    location_consistency: float
    time_consistency: float
    media_consistency: float
    overall_confidence: float

class ReportResponse(ReportBase):
    id: str
    timestamp: datetime
    verification_status: str
    confidence_score: float
    trust_score: float
    explainable_confidence: Optional[Dict[str, float]] = None
    is_duplicate: bool = False
    duplicate_of_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class EventResponse(BaseModel):
    id: str
    event_type: str
    severity: str
    city: str
    state: str
    latitude: float
    longitude: float
    start_time: datetime
    last_updated: datetime
    confidence: float
    verification_status: str
    report_count: int
    summary: Optional[str] = None

    class Config:
        from_attributes = True

class SourceResponse(BaseModel):
    id: str
    name: str
    source_type: str
    trust_score: float
    is_verified: bool
    total_reports: int
    last_active: datetime

    class Config:
        from_attributes = True

class AnalyticsSummary(BaseModel):
    total_reports: int
    verified_reports: int
    pending_reports: int
    suspicious_reports: int
    rejected_reports: int
    under_review_reports: int
    active_events: int
    last_24h_reports: int

class UserRegister(BaseModel):
    name: str
    email: str
    password: str
    role: Optional[str] = "Citizen"

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: Dict[str, Any]
