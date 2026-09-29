import datetime
import random
from typing import List, Dict, Any
from .base import BaseDataAdapter

SOCIAL_HASHTAGS = [
    "#IMD", "#IndiaWeather", "#WeatherAlert", "#HeavyRain", "#Flood",
    "#Thunderstorm", "#Heatwave", "#DelhiWeather", "#MumbaiRains", "#PatnaWeather"
]

DEMO_SOCIAL_POSTS = [
    {
        "handle": "@DelhiRainsWatch",
        "description": "Continuous heavy downpour causing waterlogging near Connaught Place & ITO junction. Drive safe! #IMD #DelhiWeather #HeavyRain",
        "city": "Delhi",
        "state": "Delhi",
        "lat": 28.6139,
        "lng": 77.2090,
        "category": "Heavy Rainfall",
        "image": "https://images.unsplash.com/photo-1519692933481-e162a57d6721?w=800&q=80"
    },
    {
        "handle": "@MumbaiRainUpdates",
        "description": "Severe flooding reported on local train tracks near Kurla and Dadar. Water level rising fast! #MumbaiRains #Flood #WeatherAlert #IMD",
        "city": "Mumbai",
        "state": "Maharashtra",
        "lat": 19.0760,
        "lng": 72.8777,
        "category": "Flooding",
        "image": "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=800&q=80"
    },
    {
        "handle": "@PatnaCitizenAlert",
        "description": "Knee-deep waterlogging around Gandhi Maidan area after cloudburst. Authorities on site. #PatnaWeather #Flood #IMD",
        "city": "Patna",
        "state": "Bihar",
        "lat": 25.5941,
        "lng": 85.1376,
        "category": "Flooding",
        "image": "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=800&q=80"
    },
    {
        "handle": "@KolkataWeatherAlert",
        "description": "Thunderstorm accompanied by gusty winds uprooting trees near Park Street. #Thunderstorm #IndiaWeather #IMD",
        "city": "Kolkata",
        "state": "West Bengal",
        "lat": 22.5726,
        "lng": 88.3639,
        "category": "Thunderstorm",
        "image": "https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?w=800&q=80"
    },
    {
        "handle": "@RajasthanHeatAlert",
        "description": "Scorching heatwave in Jaipur with temperature touching 46°C today. Stay hydrated! #Heatwave #Jaipur #IMD",
        "city": "Jaipur",
        "state": "Rajasthan",
        "lat": 26.9124,
        "lng": 75.7873,
        "category": "Heatwave",
        "image": "https://images.unsplash.com/photo-1504386106331-3e4e71712b38?w=800&q=80"
    }
]

class SocialMediaDataAdapter(BaseDataAdapter):
    """
    Social Media Data Adapter interface.
    Operates in realistic demo mode when API keys are not provided, clearly labeling posts as Demo Source.
    """
    def __init__(self, api_key: str = None):
        self.api_key = api_key

    def is_live(self) -> bool:
        return bool(self.api_key)

    def fetch_latest_posts(self, query: str = "#IMD", limit: int = 5) -> List[Dict[str, Any]]:
        if self.is_live():
            # Real Twitter/X API v2 call placeholder
            return []
        
        # Return realistic seeded social posts with "Social Media Demo" / "Demo Source" label
        sampled = random.sample(DEMO_SOCIAL_POSTS, min(limit, len(DEMO_SOCIAL_POSTS)))
        results = []
        for item in sampled:
            results.append({
                "source": item["handle"],
                "source_type": "Social Media Demo",
                "description": item["description"],
                "event_category": item["category"],
                "city": item["city"],
                "state": item["state"],
                "latitude": item["lat"],
                "longitude": item["lng"],
                "hashtags": "#IMD,#IndiaWeather," + item["category"].replace(" ", ""),
                "image_url": item["image"],
                "timestamp": datetime.datetime.utcnow().isoformat(),
                "is_demo_source": True
            })
        return results
