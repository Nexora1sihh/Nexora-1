import React from 'react';
import { CitizenReportModal } from '../components/CitizenReportModal';
import { UserCheck } from 'lucide-react';

export const CitizenReportPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-sky-400" /> Citizen Weather Reporting Portal
        </h2>
        <p className="text-xs text-slate-400">
          Report real-time weather observations, localized flooding, rain, thunderstorms, or severe weather in your city
        </p>
      </div>

      <CitizenReportModal />
    </div>
  );
};
