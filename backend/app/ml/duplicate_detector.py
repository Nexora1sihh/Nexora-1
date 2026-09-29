import math
from typing import List, Dict, Any, Optional

def haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates distance between two coordinates in kilometers using Haversine formula."""
    R = 6371.0  # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def text_similarity(text1: str, text2: str) -> float:
    """Computes Jaccard/word-set similarity between two text strings."""
    words1 = set(text1.lower().split())
    words2 = set(text2.lower().split())
    if not words1 or not words2:
        return 0.0
    intersection = words1.intersection(words2)
    union = words1.union(words2)
    return len(intersection) / len(union)

def detect_duplicates(
    new_report: Dict[str, Any],
    existing_reports: List[Dict[str, Any]],
    distance_threshold_km: float = 15.0,
    similarity_threshold: float = 0.35
) -> Optional[Dict[str, Any]]:
    """
    Scans existing reports to find potential duplicates or strongly related reports.
    Returns details if duplicate/related match found, else None.
    """
    for report in existing_reports:
        # Check if event categories match or overlap
        if report.get("event_category") == new_report.get("event_category") or \
           report.get("city") == new_report.get("city"):
            
            dist = haversine_distance(
                new_report["latitude"], new_report["longitude"],
                report["latitude"], report["longitude"]
            )
            sim = text_similarity(new_report["description"], report["description"])
            
            if dist <= distance_threshold_km and (sim >= similarity_threshold or dist < 2.0):
                return {
                    "is_duplicate": True,
                    "matched_report_id": report["id"],
                    "matched_source": report["source"],
                    "distance_km": round(dist, 2),
                    "text_similarity": round(sim, 2),
                    "reason": f"Matches report {report['id']} within {round(dist, 1)}km with {int(sim * 100)}% text similarity"
                }
    return None
