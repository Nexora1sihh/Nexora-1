import React from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  CloudLightning, 
  Activity 
} from 'lucide-react';
import { AnalyticsSummary } from '../types';

interface Props {
  summary: AnalyticsSummary | null;
  loading?: boolean;
}

export const KPICards: React.FC<Props> = ({ summary, loading }) => {
  const kpis = [
    {
      title: 'Total Reports',
      value: summary ? summary.total_reports.toLocaleString() : '---',
      icon: FileText,
      color: 'from-sky-500/20 to-sky-600/5 text-sky-400 border-sky-500/30',
      badge: 'Aggregated Ingested'
    },
    {
      title: 'Verified Reports',
      value: summary ? summary.verified_reports.toLocaleString() : '---',
      icon: CheckCircle2,
      color: 'from-emerald-500/20 to-emerald-600/5 text-emerald-400 border-emerald-500/30',
      badge: 'Corroborated AI/Human'
    },
    {
      title: 'Pending Reports',
      value: summary ? summary.pending_reports.toLocaleString() : '---',
      icon: Clock,
      color: 'from-amber-500/20 to-amber-600/5 text-amber-400 border-amber-500/30',
      badge: 'Verification Queue'
    },
    {
      title: 'Suspicious Reports',
      value: summary ? summary.suspicious_reports.toLocaleString() : '---',
      icon: AlertTriangle,
      color: 'from-rose-500/20 to-rose-600/5 text-rose-400 border-rose-500/30',
      badge: 'Low Trust Score'
    },
    {
      title: 'Active Weather Events',
      value: summary ? summary.active_events.toLocaleString() : '---',
      icon: CloudLightning,
      color: 'from-indigo-500/20 to-indigo-600/5 text-indigo-400 border-indigo-500/30',
      badge: 'Real-Time Clusters'
    },
    {
      title: 'Reports (Last 24 Hours)',
      value: summary ? summary.last_24h_reports.toLocaleString() : '---',
      icon: Activity,
      color: 'from-cyan-500/20 to-cyan-600/5 text-cyan-400 border-cyan-500/30',
      badge: 'High Ingestion Rate'
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <div
            key={idx}
            className={`bg-gradient-to-b ${kpi.color} border rounded-xl p-4 transition-all duration-200 hover:scale-[1.02] shadow-lg`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {kpi.title}
              </span>
              <Icon className="w-5 h-5 opacity-90" />
            </div>
            <div className="text-2xl font-bold text-slate-100 tracking-tight">
              {loading ? (
                <div className="h-7 w-16 bg-slate-800 animate-pulse rounded"></div>
              ) : (
                kpi.value
              )}
            </div>
            <span className="inline-block mt-2 text-[10px] font-medium text-slate-400">
              {kpi.badge}
            </span>
          </div>
        );
      })}
    </div>
  );
};
