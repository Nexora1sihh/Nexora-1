import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { WeatherReport, FilterState } from '../types';
import { MapView } from '../components/MapView';
import { FilterBar } from '../components/FilterBar';
import { EventDetailModal } from '../components/EventDetailModal';
import { Map as MapIcon } from 'lucide-react';

export const LiveMapPage: React.FC = () => {
  const [reports, setReports] = useState<WeatherReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<WeatherReport | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    dateFilter: 'All',
    eventCategory: 'All',
    state: 'All',
    city: 'All',
    verificationStatus: 'All',
    searchQuery: ''
  });

  const loadReports = async () => {
    try {
      const data = await api.getReports(filters);
      setReports(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadReports();
  }, [filters]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <MapIcon className="w-5 h-5 text-sky-400" /> National Live India Weather Map
          </h2>
          <p className="text-xs text-slate-400">
            Real-time geospatial distribution of verified and crowd-sourced weather events across India
          </p>
        </div>
      </div>

      <FilterBar filters={filters} setFilters={setFilters} onReset={() => setFilters({ dateFilter: 'All', eventCategory: 'All', state: 'All', city: 'All', verificationStatus: 'All', searchQuery: '' })} />

      <MapView
        reports={reports}
        events={[]}
        onSelectReport={(rep) => setSelectedReport(rep)}
        height="h-[650px]"
      />

      {selectedReport && (
        <EventDetailModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onVerify={async (id) => { await api.verifyReport(id); loadReports(); }}
          onReject={async (id) => { await api.rejectReport(id); loadReports(); }}
          onMarkSuspicious={async (id) => { await api.markSuspiciousReport(id); loadReports(); }}
        />
      )}
    </div>
  );
};
