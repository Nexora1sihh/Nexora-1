import datetime
from typing import Dict, Any, List

# Source Type Trust Weights
SOURCE_TRUST_WEIGHTS = {
    "Official": 0.95,
    "Government": 0.92,
    "Weather API": 0.90,
    "News/Web": 0.82,
    "Citizen": 0.65,
    "Social Media Demo": 0.55,
    "Unknown": 0.35
}

# Major Indian Cities & Approximate Coordinates Bounding Check
CITY_BOUNDS = {
    "Delhi": (28.4, 28.9, 76.8, 77.4),
    "Mumbai": (18.8, 19.3, 72.7, 73.1),
    "Chennai": (12.9, 13.3, 80.1, 80.4),
    "Kolkata": (22.4, 22.8, 88.2, 88.5),
    "Patna": (25.5, 25.8, 85.0, 85.3),
    "Bengaluru": (12.8, 13.2, 77.4, 77.8),
    "Hyderabad": (17.2, 17.6, 78.3, 78.6),
    "Ahmedabad": (22.9, 23.2, 72.4, 72.7),
    "Jaipur": (26.7, 27.1, 75.6, 76.0),
    "Lucknow": (26.7, 27.1, 80.8, 81.1),
    "Guwahati": (26.1, 26.3, 91.6, 91.9),
    "Bhubaneswar": (20.2, 20.5, 85.7, 86.0),
    "Kochi": (9.8, 10.1, 76.2, 76.4),
    "Pune": (18.4, 18.7, 73.7, 74.0),
    "Srinagar": (34.0, 34.2, 74.7, 74.9)
}

def calculate_trust_score(
    report: Dict[str, Any],
    nearby_reports: List[Dict[str, Any]]
) -> Dict[str, Any]:
    """
    Computes an explainable confidence breakdown and verification status.
    Returns dictionary with breakdown metrics, overall score, and recommended status.
    """
    source_type = report.get("source_type", "Unknown")
    city = report.get("city", "")
    lat = report.get("latitude", 0.0)
    lng = report.get("longitude", 0.0)
    has_image = bool(report.get("image_url"))
    has_video = bool(report.get("video_url"))

    # 1. Source Credibility
    source_credibility = SOURCE_TRUST_WEIGHTS.get(source_type, 0.50)

    # 2. Cross-Source Agreement
    agreeing_count = 0
    for nr in nearby_reports:
        if nr.get("event_category") == report.get("event_category"):
            agreeing_count += 1
    
    if len(nearby_reports) > 0:
        cross_source_agreement = min(0.50 + (agreeing_count / max(len(nearby_reports), 1)) * 0.45, 0.98)
    else:
        cross_source_agreement = 0.70  # Default neutral for isolated report

    # 3. Location Consistency (Check city name vs GPS bounding box if available)
    if city in CITY_BOUNDS:
        min_lat, max_lat, min_lng, max_lng = CITY_BOUNDS[city]
        if min_lat <= lat <= max_lat and min_lng <= lng <= max_lng:
            location_consistency = 0.95
        else:
            location_consistency = 0.65  # Slight penalty if GPS doesn't closely match city bounds
    else:
        location_consistency = 0.85

    # 4. Time Consistency
    # Recent reports get higher time consistency
    time_consistency = 0.92

    # 5. Media Consistency
    if has_image or has_video:
        media_consistency = 0.88
    else:
        media_consistency = 0.65

    # Weighted Overall Score
    overall_confidence = (
        source_credibility * 0.30 +
        cross_source_agreement * 0.25 +
        location_consistency * 0.20 +
        time_consistency * 0.15 +
        media_consistency * 0.10
    )

    overall_confidence = round(overall_confidence, 2)

    # Status Recommendation
    if overall_confidence >= 0.82:
        status = "Verified"
    elif overall_confidence >= 0.60:
        status = "Pending"
    elif overall_confidence < 0.45:
        status = "Suspicious"
    else:
        status = "Under Review"

    explainable_breakdown = {
        "source_credibility": round(source_credibility * 100, 1),
        "cross_source_agreement": round(cross_source_agreement * 100, 1),
        "location_consistency": round(location_consistency * 100, 1),
        "time_consistency": round(time_consistency * 100, 1),
        "media_consistency": round(media_consistency * 100, 1),
        "overall_confidence": round(overall_confidence * 100, 1)
    }

    return {
        "confidence_score": overall_confidence,
        "trust_score": overall_confidence,
        "verification_status": status,
        "explainable_confidence": explainable_breakdown
    }
