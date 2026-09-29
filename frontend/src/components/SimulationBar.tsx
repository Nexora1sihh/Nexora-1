import React, { useState } from 'react';
import { Play, CloudRain, Zap, ShieldAlert, Sparkles, CheckCircle } from 'lucide-react';
import { api } from '../services/api';

interface Props {
  onSimulationTriggered?: () => void;
}

export const SimulationBar: React.FC<Props> = ({ onSimulationTriggered }) => {
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSimulateReport = async () => {
    setLoading(true);
    try {
      const rep = await api.simulateReport();
      showToast(`⚡ New weather report simulated: ${rep.event_category} in ${rep.city}!`);
      if (onSimulationTriggered) onSimulationTriggered();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateFlood = async () => {
    setLoading(true);
    try {
      const rep = await api.simulateFlood();
      showToast(`🚨 Flood Event Simulated for Patna, Bihar! (ID: ${rep.id})`);
      if (onSimulationTriggered) onSimulationTriggered();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSimulateStorm = async () => {
    setLoading(true);
    try {
      const rep = await api.simulateStorm();
      showToast(`🌩️ Thunderstorm Alert Simulated for Delhi NCR! (ID: ${rep.id})`);
      if (onSimulationTriggered) onSimulationTriggered();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border-b border-sky-500/20 px-4 py-2 text-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
          </span>
          <span className="font-semibold text-slate-200 uppercase tracking-wider text-[11px]">
            Demo Simulation Mode
          </span>
          <span className="hidden md:inline text-slate-400 text-[11px]">
            • Simulate live ingested reports, AI classification & map updates
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSimulateReport}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1 bg-sky-600/20 hover:bg-sky-600/30 text-sky-300 border border-sky-500/30 rounded-md transition-all font-medium active:scale-95 disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Simulate Incoming Social Post
          </button>

          <button
            onClick={handleSimulateFlood}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 rounded-md transition-all font-medium active:scale-95 disabled:opacity-50"
          >
            <CloudRain className="w-3.5 h-3.5 text-amber-400" />
            Simulate Flood Reports
          </button>

          <button
            onClick={handleSimulateStorm}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-md transition-all font-medium active:scale-95 disabled:opacity-50"
          >
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            Simulate Heavy Rain Event
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-sky-500/40 text-slate-100 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-md animate-bounce">
          <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
