import React, { useState } from 'react';
import { api } from '../services/api';
import { WeatherReport } from '../types';
import { MapPin, Navigation, Upload, CheckCircle2, CloudLightning, Sparkles, X } from 'lucide-react';

interface Props {
  onReportSubmitted?: (report: WeatherReport) => void;
  onClose?: () => void;
}

const EVENT_CATEGORIES = [
  'Heavy Rainfall', 'Flooding', 'Thunderstorm', 'Heatwave', 'Fog', 'Dust Storm', 'Strong Wind', 'Other'
];

const INDIAN_CITIES = [
  { city: 'Delhi', state: 'Delhi', lat: 28.6139, lng: 77.2090 },
  { city: 'Mumbai', state: 'Maharashtra', lat: 19.0760, lng: 72.8777 },
  { city: 'Chennai', state: 'Tamil Nadu', lat: 13.0827, lng: 80.2707 },
  { city: 'Kolkata', state: 'West Bengal', lat: 22.5726, lng: 88.3639 },
  { city: 'Patna', state: 'Bihar', lat: 25.5941, lng: 85.1376 },
  { city: 'Bengaluru', state: 'Karnataka', lat: 12.9716, lng: 77.5946 },
  { city: 'Hyderabad', state: 'Telangana', lat: 17.3850, lng: 78.4867 },
  { city: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714 },
  { city: 'Jaipur', state: 'Rajasthan', lat: 26.9124, lng: 75.7873 },
  { city: 'Lucknow', state: 'Uttar Pradesh', lat: 26.8467, lng: 80.9462 },
  { city: 'Guwahati', state: 'Assam', lat: 26.1445, lng: 91.7362 },
  { city: 'Bhubaneswar', state: 'Odisha', lat: 20.2961, lng: 85.8245 },
  { city: 'Kochi', state: 'Kerala', lat: 9.9312, lng: 76.2673 },
  { city: 'Pune', state: 'Maharashtra', lat: 18.5204, lng: 73.8567 },
  { city: 'Srinagar', state: 'Jammu and Kashmir', lat: 34.0837, lng: 74.7973 }
];

export const CitizenReportModal: React.FC<Props> = ({ onReportSubmitted, onClose }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [eventCategory, setEventCategory] = useState('Heavy Rainfall');
  const [selectedCityObj, setSelectedCityObj] = useState(INDIAN_CITIES[0]);
  const [latitude, setLatitude] = useState(INDIAN_CITIES[0].lat);
  const [longitude, setLongitude] = useState(INDIAN_CITIES[0].lng);
  const [imageUrl, setImageUrl] = useState('');
  const [hashtags, setHashtags] = useState('#IMD,#WeatherAlert');
  const [loading, setLoading] = useState(false);
  const [successReport, setSuccessReport] = useState<WeatherReport | null>(null);

  const handleCityChange = (cityName: string) => {
    const found = INDIAN_CITIES.find((c) => c.city === cityName) || INDIAN_CITIES[0];
    setSelectedCityObj(found);
    setLatitude(found.lat);
    setLongitude(found.lng);
  };

  const handleUseLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLatitude(pos.coords.latitude);
          setLongitude(pos.coords.longitude);
        },
        (err) => {
          alert('Could not retrieve browser geolocation. Using selected city coordinates.');
        }
      );
    } else {
      alert('Browser geolocation is not supported.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      alert('Please enter a description for the weather event.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.submitCitizenReport({
        name: name || 'Anonymous Citizen',
        description,
        event_category: eventCategory,
        city: selectedCityObj.city,
        state: selectedCityObj.state,
        latitude,
        longitude,
        hashtags,
        image_url: imageUrl || 'https://images.unsplash.com/photo-1519692933481-e162a57d6721?w=800&q=80'
      });

      setSuccessReport(res);
      if (onReportSubmitted) onReportSubmitted(res);
    } catch (err) {
      console.error(err);
      alert('Error submitting report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
            <CloudLightning className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-100">
              Submit Citizen Weather Report
            </h3>
            <p className="text-xs text-slate-400">
              Crowdsourced weather intelligence for India with instant AI verification
            </p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {successReport ? (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6 text-center space-y-4 animate-in fade-in">
          <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
          <div>
            <h4 className="text-lg font-bold text-emerald-400">
              Report Submitted Successfully!
            </h4>
            <p className="text-xs text-slate-300 mt-1">
              Your report has been ingested and analyzed by the AI pipeline.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-left space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Generated Report ID:</span>
              <span className="font-mono font-bold text-sky-400">{successReport.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Verification Status:</span>
              <span className="font-semibold text-amber-400">{successReport.verification_status}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">AI Confidence Score:</span>
              <span className="font-semibold text-emerald-400">{Math.round(successReport.confidence_score * 100)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Classified Event:</span>
              <span className="font-semibold text-slate-200">{successReport.event_category}</span>
            </div>
          </div>

          <button
            onClick={() => setSuccessReport(null)}
            className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold transition-colors"
          >
            Submit Another Report
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">
                Your Name (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Ramesh Kumar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">
                Event Category
              </label>
              <select
                value={eventCategory}
                onChange={(e) => setEventCategory(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500"
              >
                {EVENT_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">
              Weather Description & Observations *
            </label>
            <textarea
              rows={3}
              placeholder="Describe weather situation, waterlogging level, wind speeds, visibility..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-slate-200 focus:outline-none focus:border-sky-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">
                City / Location
              </label>
              <select
                value={selectedCityObj.city}
                onChange={(e) => handleCityChange(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500"
              >
                {INDIAN_CITIES.map((c) => (
                  <option key={c.city} value={c.city}>
                    {c.city}, {c.state}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1 flex items-center justify-between">
                <span>GPS Location</span>
                <button
                  type="button"
                  onClick={handleUseLocation}
                  className="text-sky-400 hover:text-sky-300 flex items-center gap-1 text-[11px]"
                >
                  <Navigation className="w-3 h-3" /> Use My Location
                </button>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  step="0.0001"
                  value={latitude}
                  onChange={(e) => setLatitude(parseFloat(e.target.value) || 0)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200"
                  placeholder="Lat"
                />
                <input
                  type="number"
                  step="0.0001"
                  value={longitude}
                  onChange={(e) => setLongitude(parseFloat(e.target.value) || 0)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200"
                  placeholder="Lng"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">
                Photo URL / Attachment Link
              </label>
              <input
                type="text"
                placeholder="https://..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">
                Hashtags
              </label>
              <input
                type="text"
                value={hashtags}
                onChange={(e) => setHashtags(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-sky-500/20 transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            {loading ? 'Processing & Ingesting Report...' : 'Submit Weather Report'}
          </button>
        </form>
      )}
    </div>
  );
};
