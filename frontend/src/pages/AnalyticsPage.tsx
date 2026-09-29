import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { AnalyticsSummary } from '../types';
import { AnalyticsCharts } from '../components/AnalyticsCharts';
import { BarChart3, TrendingUp, AlertTriangle, ShieldCheck, MapPin } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [timeline, setTimeline] = useState<{ date: string; count: number }[]>([]);
  const [categories, setCategories] = useState<{ category: string; count: number }[]>([]);
  const [locations, setLocations] = useState<{ by_state: { state: string; count: number }[]; by_city: { city: string; count: number }[] }>({ by_state: [], by_city: [] });
  const [sources, setSources] = useState<{ source_type: string; count: number }[]>([]);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const [sum, time, cat, loc, src] = await Promise.all([
          api.getAnalyticsSummary(),
          api.getTimelineAnalytics(),
          api.getEventsAnalytics(),
          api.getLocationAnalytics(),
          api.getSourceDistribution()
        ]);
        setSummary(sum);
        setTimeline(time);
        setCategories(cat);
        setLocations(loc);
        setSources(src);
      } catch (e) {
        console.error(e);
      }
    };
    loadAnalytics();
  }, []);

  const topState = locations.by_state[0] ? locations.by_state[0].state : '---';
  const topCategory = categories[0] ? categories[0].category : '---';
  const topCity = locations.by_city[0] ? locations.by_city[0].city : '---';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-sky-400" /> Weather Big Data Analytics & Insights
        </h2>
        <p className="text-xs text-slate-400">
          Statistical visualization of weather ingestion trends, spatial hotspots, and verification distribution across India
        </p>
      </div>

      {/* Summary Highlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 bg-sky-500/20 text-sky-400 rounded-xl">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Top Affected State</span>
            <div className="text-lg font-bold text-slate-100">{topState}</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Most Reported Event</span>
            <div className="text-lg font-bold text-slate-100">{topCategory}</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 uppercase font-semibold">Highest Activity City</span>
            <div className="text-lg font-bold text-slate-100">{topCity}</div>
          </div>
        </div>
      </div>

      {/* Dynamic Recharts Charts */}
      <AnalyticsCharts
        timeline={timeline}
        categories={categories}
        locations={locations}
        sources={sources}
        summary={summary}
      />
    </div>
  );
};
