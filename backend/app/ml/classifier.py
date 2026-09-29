import re
from typing import Tuple, Dict

# Weather Event Keywords & Patterns for Indian context
EVENT_PATTERNS = {
    "Flooding": [
        r"flood", r"waterlog", r"submerged", r"deluge", r"overflow", r"inundat", r"knee-deep", r"waist-deep",
        r"water logg", r"drowning", r"river level", r"gunga", r"yamuna overflow"
    ],
    "Heavy Rainfall": [
        r"heavy rain", r"downpour", r"torrential", r"cloudburst", r"drizzle", r"heavy rainfall", r"incessant rain",
        r"pouring", r"heavy shower", r"rainstorm", r"monsoon rain", r"rain hazard"
    ],
    "Thunderstorm": [
        r"thunder", r"lightning", r"lightning strike", r"storm", r"squall", r"cloud crash", r"thunderclap", r"hailstorm", r"hail"
    ],
    "Heatwave": [
        r"heatwave", r"heat wave", r"extreme heat", r"scorching", r"sunstroke", r"loo", r"high temp", r"45 degree", r"48 degree", r"hot wave"
    ],
    "Fog": [
        r"fog", r"smog", r"dense fog", r"zero visibility", r"mist", r"winter fog", r"low visibility", r"haze"
    ],
    "Dust Storm": [
        r"dust storm", r"sandstorm", r"andhi", r"dust wave", r"brown storm", r"dust devil"
    ],
    "Strong Wind": [
        r"strong wind", r"gale", r"cyclone", r"stormy wind", r"uprooted tree", r"windstorm", r"high velocity wind", r"blast wind"
    ]
}

def classify_weather_text(description: str) -> Tuple[str, str, float]:
    """
    Classifies a weather description into primary and secondary categories with confidence score.
    Returns: (primary_category, secondary_category, confidence)
    """
    text = description.lower()
    scores = {}

    for category, patterns in EVENT_PATTERNS.items():
        count = 0
        for pat in patterns:
            matches = len(re.findall(pat, text))
            count += matches * (2 if category in ["Flooding", "Thunderstorm", "Heatwave"] else 1)
        if count > 0:
            scores[category] = count

    if not scores:
        return ("Heavy Rainfall", None, 0.60)  # Default fallback for unclassified weather reports

    sorted_scores = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    primary = sorted_scores[0][0]
    secondary = sorted_scores[1][0] if len(sorted_scores) > 1 else None

    # Calculate confidence based on keyword strength
    top_score = sorted_scores[0][1]
    confidence = min(0.65 + (top_score * 0.10), 0.98)

    return (primary, secondary, round(confidence, 2))
