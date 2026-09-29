import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import { WeatherReport, WeatherEvent } from '../types';
import { VerificationBadge } from './VerificationBadge';
import { Eye, Map as MapIcon, Layers, Globe, Compass } from 'lucide-react';

interface Props {
  reports: WeatherReport[];
  events: WeatherEvent[];
  onSelectReport?: (report: WeatherReport) => void;
  height?: string;
}

const EVENT_COLOR_MAP: Record<string, string> = {
  'Flooding': '#ef4444',       // Red
  'Heavy Rainfall': '#3b82f6', // Blue
  'Thunderstorm': '#8b5cf6',   // Purple
  'Heatwave': '#f97316',       // Orange
  'Fog': '#94a3b8',            // Gray
  'Dust Storm': '#eab308',     // Yellow
  'Strong Wind': '#14b8a6',    // Teal
  'Other': '#64748b'
};

const MAP_LAYERS = {
  satellite: {
    name: 'Satellite View',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  },
  dark: {
    name: 'Dark GIS View',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  },
  streets: {
    name: 'Street View',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }
};

const createCustomIcon = (category: string, status: string) => {
  const color = EVENT_COLOR_MAP[category] || '#3b82f6';
  const borderColor = status === 'Verified' ? '#10b981' : status === 'Suspicious' ? '#f43f5e' : '#f59e0b';

  const svgIcon = `
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="13" fill="${color}" fill-opacity="0.9" stroke="${borderColor}" stroke-width="3" />
      <circle cx="16" cy="16" r="4" fill="#ffffff" />
    </svg>
  `;

  return L.divIcon({
    html: svgIcon,
    className: 'custom-weather-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

export const MapView: React.FC<Props> = ({ reports, events, onSelectReport, height = 'h-[550px]' }) => {
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [currentLayer, setCurrentLayer] = useState<'satellite' | 'dark' | 'streets'>('satellite');
  const centerIndia: [number, number] = [22.5937, 78.9629];

  const activeLayerConfig = MAP_LAYERS[currentLayer];

  return (
    <div className={`relative w-full ${height} rounded-xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950`}>
      {/* Map Header Controls */}
      <div className="absolute top-4 right-4 z-[1000] flex flex-wrap items-center gap-2 bg-slate-900/90 border border-slate-700/80 p-1.5 rounded-xl shadow-2xl backdrop-blur-md">
        {/* Satellite & Layer Toggles */}
        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setCurrentLayer('satellite')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all ${
              currentLayer === 'satellite' ? 'bg-sky-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" /> Satellite View
          </button>
          <button
            onClick={() => setCurrentLayer('dark')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-bold transition-all ${
              currentLayer === 'dark' ? 'bg-sky-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" /> GIS Street View
          </button>
        </div>

        <button
          onClick={() => setShowHeatmap(!showHeatmap)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            showHeatmap ? 'bg-amber-500 text-white shadow-md' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          {showHeatmap ? 'Heatmap Active' : 'Toggle Heatmap'}
        </button>
      </div>

      <MapContainer
        center={centerIndia}
        zoom={5}
        scrollWheelZoom={true}
        className="w-full h-full"
      >
        <TileLayer
          key={currentLayer}
          attribution={activeLayerConfig.attribution}
          url={activeLayerConfig.url}
          maxZoom={19}
        />

        {/* Heatmap density circles mode */}
        {showHeatmap &&
          reports.map((report) => (
            <CircleMarker
              key={`heat-${report.id}`}
              center={[report.latitude, report.longitude]}
              radius={24}
              pathOptions={{
                color: EVENT_COLOR_MAP[report.event_category] || '#0284c7',
                fillColor: EVENT_COLOR_MAP[report.event_category] || '#0284c7',
                fillOpacity: 0.45,
                stroke: false,
              }}
            />
          ))}

        {/* Interactive Weather Event Markers */}
        {!showHeatmap &&
          reports.map((report) => (
            <Marker
              key={report.id}
              position={[report.latitude, report.longitude]}
              icon={createCustomIcon(report.event_category, report.verification_status)}
            >
              <Popup className="custom-popup">
                <div className="p-1 max-w-xs space-y-2">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-700/60 pb-1.5">
                    <span className="text-xs font-bold text-sky-400 uppercase tracking-wide">
                      {report.id}
                    </span>
                    <VerificationBadge status={report.verification_status} size="sm" />
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: EVENT_COLOR_MAP[report.event_category] }}></span>
                      {report.event_category}
                    </h4>
                    <p className="text-xs text-slate-300 line-clamp-2">
                      {report.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-400 pt-1 border-t border-slate-700/60">
                    <div>
                      <span className="font-semibold text-slate-300">City:</span> {report.city}, {report.state}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-300">Source:</span> {report.source_type}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-300">Confidence:</span> {Math.round(report.confidence_score * 100)}%
                    </div>
                    <div>
                      <span className="font-semibold text-slate-300">GPS:</span> {report.latitude.toFixed(2)}, {report.longitude.toFixed(2)}
                    </div>
                  </div>

                  {report.image_url && (
                    <div className="mt-2 rounded-md overflow-hidden h-24 border border-slate-700">
                      <img src={report.image_url} alt="Weather Event" className="w-full h-full object-cover" />
                    </div>
                  )}

                  {onSelectReport && (
                    <button
                      onClick={() => onSelectReport(report)}
                      className="w-full mt-2 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Full Event Details
                    </button>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-slate-900/90 border border-slate-800 p-3 rounded-xl shadow-2xl backdrop-blur-md max-w-xs">
        <h5 className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <MapIcon className="w-3.5 h-3.5 text-sky-400" /> Event Category Legend
        </h5>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-slate-300">
          {Object.entries(EVENT_COLOR_MAP).map(([cat, color]) => (
            <div key={cat} className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: color }}></span>
              <span className="truncate">{cat}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
