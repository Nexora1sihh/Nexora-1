import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { WeatherReport, AnalyticsSummary, FilterState } from '../types';
import { KPICards } from '../components/KPICards';
import { MapView } from '../components/MapView';
import { FilterBar } from '../components/FilterBar';
import { EventTable } from '../components/EventTable';
import { EventDetailModal } from '../components/EventDetailModal';
import { CloudLightning, Map as MapIcon, Table, Sparkles, Activity } from 'lucide-react';

interface Props {
  searchQuery: string;
}

export const Dashboard: React.FC<Props> = ({ searchQuery }) => {
  const [reports, setReports] = useState<WeatherReport[]>([]);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [selectedReport, setSelectedReport] = useState<WeatherReport | null>(null);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<FilterState>({
    dateFilter: 'All',
    eventCategory: 'All',
    state: 'All',
    city: 'All',
    verificationStatus: 'All',
    searchQuery: searchQuery
  });

  useEffect(() => {
    setFilters((prev) => ({ ...prev, searchQuery }));
  }, [searchQuery]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [repsData, sumData] = await Promise.all([
        api.getReports(filters),
        api.getAnalyticsSummary()
      ]);
      setReports(repsData);
      setSummary(sumData);
    } catch (e) {
      console.error('Failed to load dashboard data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters]);

  const handleResetFilters = () => {
    setFilters({
      dateFilter: 'All',
      eventCategory: 'All',
      state: 'All',
      city: 'All',
      verificationStatus: 'All',
      searchQuery: ''
    });
  };

  const handleVerify = async (id: string) => {
    await api.verifyReport(id);
    loadData();
  };

  const handleReject = async (id: string) => {
    await api.rejectReport(id);
    loadData();
  };

  const handleMarkSuspicious = async (id: string) => {
    await api.markSuspiciousReport(id);
    loadData();
  };

  return (
    <div className="space-y-6">
      {/* KPI Cards Header */}
      <KPICards summary={summary} loading={loading} />

      {/* Main Map & Live Feed Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* India Weather Map */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <MapIcon className="w-4 h-4 text-sky-400" /> Interactive India Weather Map
            </h3>
            <span className="text-xs text-slate-400">
              Showing {reports.length} Active Events / Reports
            </span>
          </div>
          <MapView
            reports={reports}
            events={[]}
            onSelectReport={(rep) => setSelectedReport(rep)}
            height="h-[480px]"
          />
        </div>

        {/* Live Weather Activity Feed */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col justify-between h-[520px]">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Activity className="w-4 h-4 text-sky-400" /> Ingested Weather Feed
              </h3>
              <span className="text-[10px] font-extrabold bg-sky-500/20 text-sky-400 px-2 py-0.5 rounded">
                Real-Time
              </span>
            </div>

            <div className="space-y-2.5 overflow-y-auto max-h-[430px] pr-1 scrollbar-thin">
              {reports.slice(0, 8).map((rep) => (
                <div
                  key={rep.id}
                  onClick={() => setSelectedReport(rep)}
                  className="bg-slate-950 border border-slate-800/80 hover:border-sky-500/50 p-3 rounded-lg cursor-pointer transition-all hover:bg-slate-800/50 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-sky-400 font-mono">{rep.id}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(rep.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-xs text-slate-200 font-medium line-clamp-2">
                    {rep.description}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>📍 {rep.city}, {rep.state}</span>
                    <span className="font-semibold text-emerald-400">{Math.round(rep.confidence_score * 100)}% Conf.</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Criteria Filters & Weather Event Table */}
      <div className="space-y-4">
        <FilterBar filters={filters} setFilters={setFilters} onReset={handleResetFilters} />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <Table className="w-4 h-4 text-sky-400" /> Multi-Source Weather Event Registry
            </h3>
          </div>
          <EventTable
            reports={reports}
            onSelectReport={(rep) => setSelectedReport(rep)}
            onVerify={handleVerify}
            onReject={handleReject}
            onMarkSuspicious={handleMarkSuspicious}
            isAdmin={true}
          />
        </div>
      </div>

      {/* Event Details Modal */}
      {selectedReport && (
        <EventDetailModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onVerify={handleVerify}
          onReject={handleReject}
          onMarkSuspicious={handleMarkSuspicious}
        />
      )}
    </div>
  );
};
