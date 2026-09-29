import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { WeatherReport, AnalyticsSummary, FilterState } from '../types';
import { EventTable } from '../components/EventTable';
import { EventDetailModal } from '../components/EventDetailModal';
import { KPICards } from '../components/KPICards';
import { ShieldAlert, CheckCircle2, XCircle, AlertTriangle, Clock, Activity, Search } from 'lucide-react';

export const AdminPage: React.FC = () => {
  const [reports, setReports] = useState<WeatherReport[]>([]);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [selectedReport, setSelectedReport] = useState<WeatherReport | null>(null);
  const [statusFilter, setStatusFilter] = useState('Pending');
  const [search, setSearch] = useState('');

  const loadAdminData = async () => {
    try {
      const [reps, sum] = await Promise.all([
        api.getReports({ verificationStatus: statusFilter, searchQuery: search }),
        api.getAnalyticsSummary()
      ]);
      setReports(reps);
      setSummary(sum);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [statusFilter, search]);

  const handleVerify = async (id: string) => {
    await api.verifyReport(id);
    loadAdminData();
  };

  const handleReject = async (id: string) => {
    await api.rejectReport(id);
    loadAdminData();
  };

  const handleMarkSuspicious = async (id: string) => {
    await api.markSuspiciousReport(id);
    loadAdminData();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-sky-400" /> Administrative Verification & Analyst Control Panel
          </h2>
          <p className="text-xs text-slate-400">
            Review queues, override AI classifications, evaluate suspicious reports, and manage source verification workflows
          </p>
        </div>
      </div>

      <KPICards summary={summary} />

      {/* Verification Queue Workflow Tabs */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            {['Pending', 'Under Review', 'Suspicious', 'Verified', 'Rejected', 'All'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  statusFilter === st
                    ? 'bg-sky-500 text-white shadow-md'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                {st} Queue
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter admin table..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* Verification Queue Table */}
        <EventTable
          reports={reports}
          onSelectReport={(rep) => setSelectedReport(rep)}
          onVerify={handleVerify}
          onReject={handleReject}
          onMarkSuspicious={handleMarkSuspicious}
          isAdmin={true}
        />
      </div>

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
