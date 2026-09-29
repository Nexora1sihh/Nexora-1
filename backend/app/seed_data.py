import datetime
import random
from sqlalchemy.orm import Session
from .models import Report, Event, Source, User, generate_report_id, generate_event_id
from .ml.classifier import classify_weather_text
from .ml.trust_scorer import calculate_trust_score

INDIAN_CITIES_COORDS = [
    ("Delhi", "Delhi", 28.6139, 77.2090),
    ("Mumbai", "Maharashtra", 19.0760, 72.8777),
    ("Chennai", "Tamil Nadu", 13.0827, 80.2707),
    ("Kolkata", "West Bengal", 22.5726, 88.3639),
    ("Patna", "Bihar", 25.5941, 85.1376),
    ("Bengaluru", "Karnataka", 12.9716, 77.5946),
    ("Hyderabad", "Telangana", 17.3850, 78.4867),
    ("Ahmedabad", "Gujarat", 23.0225, 72.5714),
    ("Jaipur", "Rajasthan", 26.9124, 75.7873),
    ("Lucknow", "Uttar Pradesh", 26.8467, 80.9462),
    ("Guwahati", "Assam", 26.1445, 91.7362),
    ("Bhubaneswar", "Odisha", 20.2961, 85.8245),
    ("Kochi", "Kerala", 9.9312, 76.2673),
    ("Pune", "Maharashtra", 18.5204, 73.8567),
    ("Srinagar", "Jammu and Kashmir", 34.0837, 74.7973)
]

EVENT_TYPES = [
    "Heavy Rainfall", "Flooding", "Thunderstorm", "Heatwave", "Fog", "Dust Storm", "Strong Wind"
]

SOURCES = [
    ("IMD_Official", "Official", 0.98, True),
    ("NDRF_Control", "Government", 0.95, True),
    ("OpenWeather_API", "Weather API", 0.92, True),
    ("Skymet_Weather", "News/Web", 0.88, True),
    ("Twitter_Demo_Feed", "Social Media Demo", 0.60, False),
    ("Citizen_Report_Portal", "Citizen", 0.70, True),
    ("Unverified_Public_Handle", "Unknown", 0.35, False)
]

WEATHER_DESCRIPTIONS = {
    "Flooding": [
        "Incessant rain for the past 6 hours has caused severe waterlogging on main roads. Water level reached knee height.",
        "Flooding reported in low-lying residential areas. NDRF teams dispatched for drainage and assistance.",
        "River water overflowed embankment near city bridge. Traffic halted on highway #IMD #Flood",
        "Underpasses completely submerged. Multiple vehicles stranded in flood waters."
    ],
    "Heavy Rainfall": [
        "Continuous heavy downpour recorded at local weather station. 110mm rainfall in 3 hours. #HeavyRain",
        "Monsoon showers causing reduced visibility on expressways. Rain spell expected to continue till evening.",
        "Torrential rain spell hit central market area. Local authorities issue yellow alert. #IndiaWeather",
        "High rainfall intensity causing drainage backflow in several sectors."
    ],
    "Thunderstorm": [
        "Severe thunderstorm with frequent lightning strikes and gusty winds up to 60 km/h recorded. #WeatherAlert",
        "Thunderstorm accompanied by localized hailstorm damaging standing crops. #Thunderstorm #IMD",
        "Sudden squall and heavy thunder burst trees near main boulevard. Power outage reported.",
        "High voltage lightning strikes hit telecom tower in outer district."
    ],
    "Heatwave": [
        "Scorching heatwave conditions prevail. Maximum temperature crossed 45.4°C today. #Heatwave #IndiaWeather",
        "Severe heatwave warning issued by meteorological center. Loo winds blowing at 30 km/h.",
        "Extreme heat wave day recorded with humidity spiking heat index to 48°C.",
        "Public advisory issued to avoid outdoor travel between 12 PM and 4 PM due to intense sunstroke risk."
    ],
    "Fog": [
        "Dense winter fog reducing visibility below 20 meters on highway. Flight operations delayed. #Fog #WeatherAlert",
        "Thick fog envelope covering outer ring road. Train services running with delay.",
        "Zero visibility reported at airport runway during early morning hours.",
        "Pockets of shallow to moderate fog disrupting morning traffic flow."
    ],
    "Dust Storm": [
        "Sudden dust storm (Andhi) reducing visibility drastically across city. Wind speeds reaching 55 km/h. #DustStorm",
        "Thick dust cloud covering urban sky followed by mild showers. #IMD",
        "Brown sandstorm sweeping across agricultural belt damaging temporary sheds.",
        "High dust concentration causing eye irritation and severe haze."
    ],
    "Strong Wind": [
        "High velocity winds uprooted multiple electric poles and advertising hoardings near main square.",
        "Gale force winds blowing along coastal areas with rough sea conditions. #StrongWind",
        "Wind squall passing through city with gusts clocking 72 km/h.",
        "Strong gusty winds damaging tin roofs in industrial estate."
    ]
}

SAMPLE_IMAGES = {
    "Flooding": [
        "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&q=80",
        "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800&q=80"
    ],
    "Heavy Rainfall": [
        "https://images.unsplash.com/photo-1519692933481-e162a57d6721?w=800&q=80",
        "https://images.unsplash.com/photo-1428592953211-077101b2021b?w=800&q=80"
    ],
    "Thunderstorm": [
        "https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?w=800&q=80",
        "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=800&q=80"
    ],
    "Heatwave": [
        "https://images.unsplash.com/photo-1504386106331-3e4e71712b38?w=800&q=80",
        "https://images.unsplash.com/photo-1527482797697-8795b05a13fe?w=800&q=80"
    ],
    "Fog": [
        "https://images.unsplash.com/photo-1487621167305-5d248087c724?w=800&q=80",
        "https://images.unsplash.com/photo-1517483000871-1dbf64a6e1c6?w=800&q=80"
    ],
    "Dust Storm": [
        "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&q=80"
    ],
    "Strong Wind": [
        "https://images.unsplash.com/photo-1499346030926-9a72daac6c63?w=800&q=80"
    ]
}

def seed_database(db: Session):
    # Check if already seeded
    if db.query(Report).count() >= 50:
        return

    print("Seeding database with 100+ realistic weather reports across India...")

    # Seed Sources
    source_objs = []
    for name, stype, trust, is_ver in SOURCES:
        src = Source(
            name=name,
            source_type=stype,
            trust_score=trust,
            is_verified=is_ver,
            total_reports=random.randint(15, 80),
            last_active=datetime.datetime.utcnow()
        )
        db.add(src)
        source_objs.append(src)

    # Seed Admin User
    admin_user = User(
        name="NWIP Admin Analyst",
        email="admin@nwip.gov.in",
        password_hash="pbkdf2:sha256:hackathon2026", # Demo password
        role="Admin"
    )
    db.add(admin_user)

    now = datetime.datetime.utcnow()

    # Create 110 Reports
    created_reports = []
    for i in range(110):
        city, state, base_lat, base_lng = random.choice(INDIAN_CITIES_COORDS)
        category = random.choice(EVENT_TYPES)
        desc_template = random.choice(WEATHER_DESCRIPTIONS[category])
        
        # Add slight jitter to lat/lng for spatial dispersion
        lat = base_lat + random.uniform(-0.12, 0.12)
        lng = base_lng + random.uniform(-0.12, 0.12)

        src_name, src_type, src_trust, _ = random.choice(SOURCES)
        
        # Random timestamp within last 7 days
        hours_ago = random.randint(0, 168)
        report_time = now - datetime.timedelta(hours=hours_ago, minutes=random.randint(0, 59))

        # Status distribution
        rand_val = random.random()
        if rand_val < 0.60:
            status = "Verified"
        elif rand_val < 0.80:
            status = "Pending"
        elif rand_val < 0.90:
            status = "Suspicious"
        elif rand_val < 0.96:
            status = "Under Review"
        else:
            status = "Rejected"

        image_options = SAMPLE_IMAGES.get(category, [])
        image_url = random.choice(image_options) if image_options and random.random() > 0.3 else None

        report_dict = {
            "source": f"{src_name}_{random.randint(10, 99)}",
            "source_type": src_type,
            "description": f"[{city}, {state}] {desc_template}",
            "event_category": category,
            "city": city,
            "state": state,
            "latitude": lat,
            "longitude": lng,
            "image_url": image_url
        }

        trust_res = calculate_trust_score(report_dict, created_reports[-10:] if created_reports else [])

        report = Report(
            id=generate_report_id(),
            source=report_dict["source"],
            source_type=src_type,
            timestamp=report_time,
            description=report_dict["description"],
            event_category=category,
            secondary_category="Heavy Rainfall" if category == "Flooding" else None,
            city=city,
            state=state,
            district=f"{city} Central",
            latitude=lat,
            longitude=lng,
            hashtags=f"#IMD,#IndiaWeather,#{category.replace(' ', '')},#{city}Weather",
            verification_status=status,
            confidence_score=trust_res["confidence_score"] if status != "Suspicious" else round(random.uniform(0.20, 0.42), 2),
            trust_score=trust_res["trust_score"],
            explainable_confidence=trust_res["explainable_confidence"],
            image_url=image_url,
            created_at=report_time,
            updated_at=report_time
        )
        db.add(report)
        created_reports.append(report_dict)

    db.commit()

    # Group into Active Events
    for city, state, base_lat, base_lng in INDIAN_CITIES_COORDS:
        for cat in random.sample(EVENT_TYPES, 2):
            count = db.query(Report).filter(Report.city == city, Report.event_category == cat).count()
            if count > 0:
                evt = Event(
                    id=generate_event_id(),
                    event_type=cat,
                    severity=random.choice(["High", "Severe", "Moderate", "Extreme"]),
                    city=city,
                    state=state,
                    latitude=base_lat,
                    longitude=base_lng,
                    start_time=now - datetime.timedelta(hours=random.randint(2, 48)),
                    last_updated=now,
                    confidence=round(random.uniform(0.80, 0.98), 2),
                    verification_status="Verified" if count > 2 else "Under Review",
                    report_count=count,
                    summary=f"Active {cat} event in {city}, {state} corroborated by {count} multi-source weather reports."
                )
                db.add(evt)

    db.commit()
    print("Database seeding completed successfully!")
