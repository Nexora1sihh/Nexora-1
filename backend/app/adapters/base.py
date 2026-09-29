from abc import ABC, abstractmethod
from typing import List, Dict, Any

class BaseDataAdapter(ABC):
    """
    Abstract Base Class for Weather Data Ingestion Adapters.
    Allows seamlessly plugging in real social media APIs, official IMD RSS feeds, or OpenWeatherMap endpoints.
    """
    
    @abstractmethod
    def fetch_latest_posts(self, query: str = "#IMD", limit: int = 10) -> List[Dict[str, Any]]:
        """Fetch latest weather-related posts or reports from data source."""
        pass

    @abstractmethod
    def is_live(self) -> bool:
        """Returns True if connected to live external API, False if operating in Demo Adapter mode."""
        pass
