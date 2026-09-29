import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { DataSource } from '../types';
import { Database, ShieldCheck, CheckCircle2, Globe, Radio, UserCheck, AlertCircle } from 'lucide-react';

export const SourcesPage: React.FC = () => {
  const [sources, setSources] = useState<DataSource[]>([]);

  useEffect(() => {
    api.getSources().then(setSources).catch(console.error);
  }, []);

  const staticSources = [
    {
      name: 'IMD Official Weather API / RSS',
      type: 'Official',
      trust: 0.98,
      status: 'ACTIVE',
      reports: 48,
      desc: 'Official Meteorological Department forecast and warning feed for Indian States.'
    },
    {
      name: 'NDRF & State Disaster Relief Portal',
      type: 'Government',
      trust: 0.95,
      status: 'ACTIVE',
      reports: 35,
      desc: 'National Disaster Response Force emergency incident reporting channel.'
    },
    {
      name: 'OpenWeatherMap Public API',
      type: 'Weather API',
      trust: 0.92,
      status: 'ACTIVE',
      reports: 62,
      desc: 'Global meteorological API providing satellite rainfall and temperature observations.'
    },
    {
      name: 'Skymet Weather RSS Channel',
      type: 'News/Web',
      trust: 0.88,
      status: 'ACTIVE',
      reports: 28,
      desc: 'Private weather forecasting network news and weather update feed.'
    },
    {
      name: 'Social Media Weather Adapter (#IMD)',
      type: 'Social Media Demo',
      trust: 0.60,
      status: 'DEMO ADAPTER MODE',
      reports: 42,
      desc: 'Social Media Data Adapter configured in Demo Mode for #IMD, #IndiaWeather, #DelhiRains, #MumbaiRains. Clearly labeled as Demo Source.'
    },
    {
      name: 'NWIP Citizen Crowd-source Portal',
      type: 'Citizen',
      trust: 0.70,
      status: 'ACTIVE',
      reports: 55,
      desc: 'Crowdsourced weather reporting portal for Indian citizens with location verification.'
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Database className="w-5 h-5 text-sky-400" /> Platform Data Sources & Connectors
        </h2>
        <p className="text-xs text-slate-400">
          Overview of official APIs, public datasets, social media adapters, and citizen input channels
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {staticSources.map((src, idx) => (
          <div
            key={idx}
            className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-sky-500/20 text-sky-400 border border-sky-500/30">
                  {src.type}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  src.status.includes('DEMO') ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {src.status}
                </span>
              </div>

              <h3 className="font-bold text-slate-100 text-sm">{src.name}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{src.desc}</p>
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80 space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Baseline Trust Level:</span>
                <span className="font-bold text-emerald-400">{Math.round(src.trust * 100)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Ingested Reports:</span>
                <span className="font-bold text-slate-200">{src.reports}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
