import React from 'react';
import { 
  Database, 
  Cpu, 
  Globe, 
  Server, 
  Workflow, 
  Radio, 
  Brain, 
  ShieldCheck, 
  HardDrive, 
  CheckCircle2, 
  Activity 
} from 'lucide-react';
import { SystemStatus } from '../types';

interface Props {
  status: SystemStatus | null;
}

export const SystemArchitecture: React.FC<Props> = ({ status }) => {
  const pipelineSteps = [
    {
      title: '1. Multi-Source Ingestion',
      icon: Globe,
      color: 'border-sky-500/40 bg-sky-500/10 text-sky-400',
      description: 'Official IMD RSS feeds, Weather APIs, Citizen Portal, & Social Media Adapter (#IMD, #IndiaWeather)'
    },
    {
      title: '2. Apache Kafka Streaming',
      icon: Radio,
      color: 'border-amber-500/40 bg-amber-500/10 text-amber-400',
      description: 'High-throughput real-time message queue publishing weather reports to topic "nwip-weather-reports"'
    },
    {
      title: '3. Spark & AI/ML Processing',
      icon: Brain,
      color: 'border-indigo-500/40 bg-indigo-500/10 text-indigo-400',
      description: 'Event classification, duplicate detection (Haversine + Jaccard), and trust score calculation'
    },
    {
      title: '4. PostGIS & MinIO Storage',
      icon: Database,
      color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400',
      description: 'Geospatial relational indexing in PostgreSQL/PostGIS & object storage for photos/videos'
    },
    {
      title: '5. FastAPI REST & WebSockets',
      icon: Server,
      color: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-400',
      description: 'High performance RESTful endpoints + WebSocket server broadcasting live updates to dashboard'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Platform Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              National Weather Intelligence Platform Architecture
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Real-Time Distributed Pipeline Architecture for High-Volume Weather Data
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4" /> System Operational
          </div>
        </div>

        {/* Telemetry Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 font-medium">Platform Status:</span>
            <div className="text-sm font-bold text-emerald-400">{status?.status || 'ONLINE'}</div>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Backend Framework:</span>
            <div className="text-sm font-bold text-sky-400">FastAPI + Uvicorn</div>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Database Storage:</span>
            <div className="text-sm font-bold text-indigo-400">PostgreSQL / PostGIS</div>
          </div>
          <div>
            <span className="text-slate-400 font-medium">Streaming Engine:</span>
            <div className="text-sm font-bold text-amber-400">Apache Kafka</div>
          </div>
        </div>
      </div>

      {/* Pipeline Diagram */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-6 flex items-center gap-2">
          <Workflow className="w-4 h-4 text-sky-400" /> End-to-End Data Pipeline Visualizer
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {pipelineSteps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={idx}
                className={`border rounded-xl p-4 flex flex-col justify-between ${step.color} shadow-lg transition-all hover:scale-105`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="w-6 h-6" />
                    <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-slate-950/60 border border-current">
                      Step {idx + 1}
                    </span>
                  </div>
                  <h5 className="font-bold text-slate-100 text-sm mb-1">{step.title}</h5>
                  <p className="text-[11px] text-slate-300 leading-relaxed">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Services Health Check Matrix */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
        <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Activity className="w-4 h-4 text-sky-400" /> Live Services Health Check Matrix
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {status?.services &&
            Object.entries(status.services).map(([key, value]) => (
              <div key={key} className="bg-slate-950 border border-slate-800 rounded-lg p-3 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-200 uppercase">{key.replace('_', ' ')}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {value.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {value.mode || value.type || `Topic: ${value.topic}` || `Port: ${value.port}`}
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
