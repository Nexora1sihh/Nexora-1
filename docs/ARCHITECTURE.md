# NWIP System Architecture & Component Design

The **National Weather Intelligence Platform (NWIP)** processes multi-source weather reports across India using a scalable distributed pipeline.

```
+-----------------------------------------------------------------------------------+
|                                 DATA INGESTION                                    |
|  [ Official Weather APIs ] [ Public Datasets ] [ Social Media Adapter (#IMD) ]    |
|  [ Govt / NDRF Feeds ]    [ Citizen Reports ] [ News & Web Scrapers ]             |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                             APACHE KAFKA STREAMING                                |
|  Topic: `nwip-weather-reports` (Real-Time Ingestion Queue)                         |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                        APACHE SPARK & AI/ML PROCESSING                            |
|  1. Event Classification (Rule-based NLP & Scikit-Learn MultinomialNB)            |
|  2. Duplicate & Proximity Detection (Haversine Distance + Jaccard Similarity)    |
|  3. Explainable Trust Scoring (Source Credibility, Cross-Source Agreement, GPS)   |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                            POSTGRESQL / POSTGIS & MINIO                           |
|  - PostGIS: Spatial indexing for India map coordinates                            |
|  - MinIO: S3-compatible Object Storage for photos/videos                          |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                            FASTAPI BACKEND & WEBSOCKET                            |
|  - RESTful APIs for Reports, Events, Analytics, Sources, Verification Workflow    |
|  - WebSocket `/ws/events` broadcasting real-time updates                          |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                         REACT + TAILWIND + LEAFLET DASHBOARD                      |
|  - Live India Weather Map, KPI Cards, Recharts Analytics, Admin Verification      |
+-----------------------------------------------------------------------------------+
```
