import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { SystemStatus as SystemStatusType } from '../types';
import { SystemArchitecture } from '../components/SystemArchitecture';
import { Cpu } from 'lucide-react';

export const ArchitecturePage: React.FC = () => {
  const [status, setStatus] = useState<SystemStatusType | null>(null);

  useEffect(() => {
    api.getSystemStatus().then(setStatus).catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-sky-400" /> Platform Architecture & System Status
        </h2>
        <p className="text-xs text-slate-400">
          Technical component overview of streaming, ML verification, and distributed storage infrastructure
        </p>
      </div>

      <SystemArchitecture status={status} />
    </div>
  );
};
