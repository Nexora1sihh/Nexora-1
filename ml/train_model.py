import os
import joblib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline

# Sample Weather Ingestion Training Dataset for India
TRAINING_DATA = [
    ("Heavy rainfall and urban waterlogging in Patna Gandhi Maidan", "Flooding"),
    ("Monsoon deluge submerge road underpass near Kurla station Mumbai", "Flooding"),
    ("Incessant downpour 120mm rain in Delhi ITO junction", "Heavy Rainfall"),
    ("Torrential rain spell causing traffic jam on Jaipur express highway", "Heavy Rainfall"),
    ("Severe thunderstorm with lightning strike and gusty squall 65kmh", "Thunderstorm"),
    ("Hailstorm damaging standing crops in West Bengal district", "Thunderstorm"),
    ("Scorching heatwave temperature touching 46 degree celsius in Rajasthan", "Heatwave"),
    ("Extreme hot wave condition Loo blowing in Delhi NCR", "Heatwave"),
    ("Dense winter fog reducing visibility below 20 meters on highway", "Fog"),
    ("Thick smog envelope delaying flight operations at airport", "Fog"),
    ("Sudden dust storm sandstorm Andhi sweeping city 55kmh", "Dust Storm"),
    ("High velocity gale winds uprooting electric poles in coastal belt", "Strong Wind")
]

def train_and_save_model():
    df = pd.DataFrame(TRAINING_DATA, columns=["text", "category"])
    
    pipeline = Pipeline([
        ('tfidf', TfidfVectorizer(ngram_range=(1, 2))),
        ('clf', MultinomialNB())
    ])
    
    pipeline.fit(df["text"], df["category"])
    
    os.makedirs("ml/model", exist_ok=True)
    model_path = "ml/model/weather_classifier.joblib"
    joblib.dump(pipeline, model_path)
    print(f"Weather classification ML model trained and saved to {model_path}")

if __name__ == "__main__":
    train_and_save_model()
