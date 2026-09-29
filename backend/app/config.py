import os

class Settings:
    PROJECT_NAME: str = "National Weather Intelligence Platform"
    PROJECT_SHORT_NAME: str = "NWIP"
    TAGLINE: str = "Real-Time Multi-Source Weather Intelligence & Verification"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    SECRET_KEY: str = os.getenv("SECRET_KEY", "nwip-secret-key-hackathon-2026-secure-jwt-token")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database configuration (PostgreSQL / PostGIS supported, SQLite fallback)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./nwip_weather.db")
    
    # Object Storage (MinIO / S3 fallback to local uploads)
    MINIO_ENDPOINT: str = os.getenv("MINIO_ENDPOINT", "localhost:9000")
    MINIO_ACCESS_KEY: str = os.getenv("MINIO_ACCESS_KEY", "minioadmin")
    MINIO_SECRET_KEY: str = os.getenv("MINIO_SECRET_KEY", "minioadmin")
    MINIO_BUCKET: str = os.getenv("MINIO_BUCKET", "nwip-media")
    
    # Kafka Stream configuration
    KAFKA_BOOTSTRAP_SERVERS: str = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")
    KAFKA_TOPIC_WEATHER_REPORTS: str = "nwip-weather-reports"
    
    # Demo Mode
    DEMO_MODE: bool = True

settings = Settings()
