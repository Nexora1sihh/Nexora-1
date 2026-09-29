import React from 'react';
import { Filter, Calendar, MapPin, ShieldCheck, Tag, RefreshCw } from 'lucide-react';
import { FilterState } from '../types';

interface Props {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onReset?: () => void;
}

const INDIAN_STATES = [
  'All', 'Delhi', 'Maharashtra', 'Tamil Nadu', 'West Bengal', 'Bihar',
  'Karnataka', 'Telangana', 'Gujarat', 'Rajasthan', 'Uttar Pradesh',
  'Assam', 'Odisha', 'Kerala', 'Jammu and Kashmir'
];

const INDIAN_CITIES = [
  'All', 'Delhi', 'Mumbai', 'Chennai', 'Kolkata', 'Patna',
  'Bengaluru', 'Hyderabad', 'Ahmedabad', 'Jaipur', 'Lucknow',
  'Guwahati', 'Bhubaneswar', 'Kochi', 'Pune', 'Srinagar'
];

const EVENT_TYPES = [
  'All', 'Heavy Rainfall', 'Flooding', 'Thunderstorm', 'Heatwave', 'Fog', 'Dust Storm', 'Strong Wind'
];

const VERIFICATION_STATUSES = [
  'All', 'Verified', 'Pending', 'Suspicious', 'Under Review', 'Rejected'
];

export const FilterBar: React.FC<Props> = ({ filters, setFilters, onReset }) => {
  const handleChange = (field: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl mb-6 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-sky-400" />
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Multi-Criteria Data Filters
          </h3>
        </div>
        {onReset && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset Filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        {/* Date Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-sky-400" /> Date Range
          </label>
          <select
            value={filters.dateFilter}
            onChange={(e) => handleChange('dateFilter', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
          >
            <option value="All">All Time</option>
            <option value="today">Today</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>

        {/* Event Category Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-sky-400" /> Event Category
          </label>
          <select
            value={filters.eventCategory}
            onChange={(e) => handleChange('eventCategory', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
          >
            {EVENT_TYPES.map((evt) => (
              <option key={evt} value={evt}>
                {evt}
              </option>
            ))}
          </select>
        </div>

        {/* Location (State / City) Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-sky-400" /> State / City Location
          </label>
          <select
            value={filters.state}
            onChange={(e) => handleChange('state', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
          >
            <option value="All">All States / Cities</option>
            {INDIAN_STATES.filter((s) => s !== 'All').map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* Verification Status Filter */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" /> Verification Status
          </label>
          <select
            value={filters.verificationStatus}
            onChange={(e) => handleChange('verificationStatus', e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-sky-500"
          >
            {VERIFICATION_STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
