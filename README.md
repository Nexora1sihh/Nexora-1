# National Weather Intelligence Platform (NWIP)
> **Tagline:** Real-Time Multi-Source Weather Intelligence & Verification  
> **Problem Statement:** Scalable National Weather Big Data Analytics Platform for India

---

## 📖 Overview

The **National Weather Intelligence Platform (NWIP)** is a scalable weather big data analytics platform designed to collect, process, classify, verify, geolocate, and visualize real-time weather information across India.

It aggregates weather inputs from:
1. **Official / Weather APIs** (IMD RSS, OpenWeatherMap)
2. **Public Datasets** (Meteorological records)
3. **Public Web Sources** (News RSS feeds)
4. **Social Media Adapters** (Posts tagged with `#IMD`, `#IndiaWeather`, `#WeatherAlert`, `#HeavyRain`, `#Flood`, `#Thunderstorm`, `#Heatwave`, `#DelhiWeather`, `#MumbaiRains`, `#PatnaWeather`, clearly labeled as **"Demo Source"**)
5. **Citizen Reports** (Crowdsourced portal with GPS & media upload)

---

## 🛠️ Technology Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS, Leaflet + OpenStreetMap, Recharts, Lucide Icons, WebSockets
- **Backend:** Python 3.11+, FastAPI, Uvicorn, SQLAlchemy, WebSockets
- **Database:** PostgreSQL with PostGIS extension (SQLite fallback for instant local zero-dependency runs)
- **Streaming & Analytics:** Apache Kafka (streaming queue), Apache Spark (batch & analytics processing)
- **AI/ML Subsystem:** Scikit-Learn NLP Classifier, Haversine Spatial Duplicate Detector, Explainable Trust & Confidence Scorer
- **Object Storage:** MinIO / S3 for image and video evidence storage
- **Deployment:** Docker & Docker Compose

---

## 🚀 Quick Start (Local Prototype)

### 1. Launch Everything with 1 Command
```bash
python start.py
```
This automatically starts:
- **FastAPI Backend Server:** `http://localhost:8000` (Docs: `http://localhost:8000/docs`)
- **React Frontend Dashboard:** `http://localhost:3000`

---

### 2. Manual Launch Options

#### Run Backend:
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

#### Run Frontend:
```bash
cd frontend
npm install
npm run dev
```

#### Run via Docker Compose:
```bash
docker-compose up --build
```

---

## 🎯 Key Hackathon Demonstration Flow (5-Minute Walkthrough)

1. **Open Dashboard:** Navigate to `http://localhost:3000`. Observe live KPI cards (*Total Reports: 110+*, *Verified*, *Pending*, *Suspicious*, *Active Events*, *24h Count*) fetched from the database.
2. **Interactive India Map:** View color-coded event markers on the Leaflet map. Click any marker (e.g. in Patna, Delhi, or Mumbai) to see Event ID, GPS, source, description, confidence score, and uploaded photos.
3. **Filter Data:** Test Date-wise filtering, Event category filtering (*Flooding*, *Heavy Rainfall*, *Thunderstorm*, *Heatwave*), State/City filtering, and Verification status.
4. **Submit Citizen Report:** Click **"Citizen Reports"**, select a city or click **"Use My Location"**, enter a weather observation, and submit. Notice the instant AI classification, confidence score calculation, and Report ID generation (e.g. `NWIP-2026-004821`).
5. **Admin Panel Verification:** Open **"Admin Panel"**, filter by *Pending Queue*, review AI confidence breakdowns, and click **"Verify Report"** or **"Mark Suspicious"**.
6. **Real-Time Simulation:** Click **"Simulate Flood Reports"** or **"Simulate Heavy Rain Event"** in the top simulation bar. Watch the new report broadcast live over WebSockets and update the map and analytics without page refresh!
7. **Analytics & Architecture:** View Recharts timeline charts, state breakdown, and the end-to-end distributed system pipeline diagram.

---

## ⚙️ Environment Variables (`.env`)

```env
PROJECT_NAME="National Weather Intelligence Platform"
PROJECT_SHORT_NAME="NWIP"
TAGLINE="Real-Time Multi-Source Weather Intelligence & Verification"
SECRET_KEY="nwip-secret-key-hackathon-2026"
DATABASE_URL="sqlite:///./nwip_weather.db"
MINIO_ENDPOINT="localhost:9000"
KAFKA_BOOTSTRAP_SERVERS="localhost:9092"
DEMO_MODE=true
```

---

## 📜 Database Seeding

The platform auto-seeds 100+ realistic weather reports across major Indian cities (Delhi, Mumbai, Chennai, Kolkata, Patna, Bengaluru, Hyderabad, Ahmedabad, Jaipur, Lucknow, Guwahati, Bhubaneswar, Kochi, Pune, Srinagar) upon first backend boot.

To manually re-seed:
```bash
cd backend
python -c "from app.database import SessionLocal; from app.seed_data import seed_database; db = SessionLocal(); seed_database(db); db.close()"
```

---

## 📂 Project Structure

```
├── backend/
│   ├── app/
│   │   ├── api/            # API endpoints (reports, events, analytics, sources, citizen, demo, system, auth)
│   │   ├── ml/             # AI/ML classification, duplicate detection, explainable trust scorer
│   │   ├── adapters/       # Data adapters (Social Media Demo, Weather API)
│   │   ├── config.py       # Settings
│   │   ├── database.py     # SQLAlchemy DB connection
│   │   ├── models.py       # Report, Event, Source, User database models
│   │   ├── seed_data.py    # 100+ Indian weather reports seed generator
│   │   ├── websocket.py   # WebSocket broadcast manager
│   │   └── main.py         # FastAPI main application
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/     # MapView, KPICards, EventTable, FilterBar, EventDetailModal, CitizenReportModal, AnalyticsCharts, SystemArchitecture
│   │   ├── pages/          # Dashboard, LiveMapPage, EventsPage, CitizenReportPage, AnalyticsPage, SourcesPage, AdminPage, ArchitecturePage
│   │   ├── services/       # API & WebSocket client
│   │   ├── types/          # TypeScript interfaces
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── ml/
│   └── train_model.py      # Model training script
├── docker/
│   ├── Dockerfile.backend
│   └── Dockerfile.frontend
├── docker-compose.yml
├── start.py                # 1-command platform launcher
└── README.md
```

---

## 📌 Limitations & Future Scope
- **Social Media APIs:** Uses a modular adapter pattern with seeded demo posts tagged `#IMD` due to public API access restrictions. Production deployment allows plugging in official Twitter/X Enterprise v2 API keys without changing pipeline code.
- **Advanced Computer Vision:** Image metadata and media consistency checks are implemented; full satellite image segmentation models can be integrated via ONNX runtime.

---

## ⚖️ License
Built for National Weather Big Data Analytics Platform Hackathon 2026.
