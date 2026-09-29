import os
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .config import settings
from .database import engine, Base, SessionLocal
from .seed_data import seed_database
from .websocket import manager

from .api.reports import router as reports_router
from .api.events import router as events_router
from .api.analytics import router as analytics_router
from .api.sources import router as sources_router
from .api.citizen import router as citizen_router
from .api.demo import router as demo_router
from .api.system import router as system_router
from .api.auth import router as auth_router

# Create DB Tables automatically
Base.metadata.create_all(bind=engine)

# Auto seed demo data
db = SessionLocal()
try:
    seed_database(db)
finally:
    db.close()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description=f"{settings.TAGLINE}. National Weather Big Data Analytics Platform for India.",
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(reports_router, prefix=settings.API_V1_STR)
app.include_router(events_router, prefix=settings.API_V1_STR)
app.include_router(analytics_router, prefix=settings.API_V1_STR)
app.include_router(sources_router, prefix=settings.API_V1_STR)
app.include_router(citizen_router, prefix=settings.API_V1_STR)
app.include_router(demo_router, prefix=settings.API_V1_STR)
app.include_router(system_router, prefix=settings.API_V1_STR)
app.include_router(auth_router, prefix=settings.API_V1_STR)

@app.websocket("/ws/events")
async def websocket_events(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Keep-alive heartbeat echo if client sends message
            await websocket.send_text(f'{{"type": "PONG", "message": "Received {data}"}}')
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception:
        manager.disconnect(websocket)

@app.get("/")
def root():
    return {
        "platform": settings.PROJECT_NAME,
        "short_name": settings.PROJECT_SHORT_NAME,
        "tagline": settings.TAGLINE,
        "documentation": "/docs",
        "health": "/api/system/status"
    }

# Mount static files if frontend build exists
frontend_dist = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "frontend", "dist")
if os.path.exists(frontend_dist):
    app.mount("/app", StaticFiles(directory=frontend_dist, html=True), name="static")
