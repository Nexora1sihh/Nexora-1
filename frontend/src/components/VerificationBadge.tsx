import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, HelpCircle, XCircle } from 'lucide-react';
import { VerificationStatus } from '../types';

interface Props {
  status: VerificationStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const VerificationBadge: React.FC<Props> = ({ status, size = 'md' }) => {
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5 font-medium',
    lg: 'px-3 py-1.5 text-sm gap-2 font-semibold',
  };

  switch (status) {
    case 'Verified':
      return (
        <span className={`inline-flex items-center rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 ${sizeClasses[size]}`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          Verified
        </span>
      );
    case 'Pending':
      return (
        <span className={`inline-flex items-center rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 ${sizeClasses[size]}`}>
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          Pending
        </span>
      );
    case 'Suspicious':
      return (
        <span className={`inline-flex items-center rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 ${sizeClasses[size]}`}>
          <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
          Suspicious
        </span>
      );
    case 'Under Review':
      return (
        <span className={`inline-flex items-center rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 ${sizeClasses[size]}`}>
          <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
          Under Review
        </span>
      );
    case 'Rejected':
      return (
        <span className={`inline-flex items-center rounded-full bg-slate-500/20 text-slate-400 border border-slate-500/30 ${sizeClasses[size]}`}>
          <XCircle className="w-3.5 h-3.5 text-slate-400" />
          Rejected
        </span>
      );
    default:
      return null;
  }
};
