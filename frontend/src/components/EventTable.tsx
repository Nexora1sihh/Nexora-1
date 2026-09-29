import React, { useState } from 'react';
import { WeatherReport } from '../types';
import { VerificationBadge } from './VerificationBadge';
import { Eye, CheckCircle2, XCircle, AlertTriangle, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  reports: WeatherReport[];
  onSelectReport: (report: WeatherReport) => void;
  onVerify?: (id: string) => void;
  onReject?: (id: string) => void;
  onMarkSuspicious?: (id: string) => void;
  isAdmin?: boolean;
}

export const EventTable: React.FC<Props> = ({
  reports,
  onSelectReport,
  onVerify,
  onReject,
  onMarkSuspicious,
  isAdmin = false
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const totalPages = Math.ceil(reports.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const currentReports = reports.slice(startIndex, startIndex + pageSize);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-950 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
              <th className="px-4 py-3">Report ID</th>
              <th className="px-4 py-3">Date / Time</th>
              <th className="px-4 py-3">Event Category</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Verification</th>
              <th className="px-4 py-3">Confidence</th>
              <th className="px-4 py-3">Media</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-200">
            {currentReports.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-slate-400">
                  No weather reports match the selected filters.
                </td>
              </tr>
            ) : (
              currentReports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-sky-400">
                    {report.id}
                  </td>
                  <td className="px-4 py-3 text-slate-400 whitespace-nowrap">
                    {new Date(report.timestamp).toLocaleString('en-IN', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                      {report.event_category}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="font-semibold">{report.city}</span>, {report.state}
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[11px]">
                      {report.source_type}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <VerificationBadge status={report.verification_status} size="sm" />
                  </td>
                  <td className="px-4 py-3 font-semibold">
                    <span className={report.confidence_score >= 0.8 ? 'text-emerald-400' : report.confidence_score < 0.45 ? 'text-rose-400' : 'text-amber-400'}>
                      {Math.round(report.confidence_score * 100)}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {report.image_url ? (
                      <span className="inline-flex items-center gap-1 text-sky-400 text-[11px] font-medium">
                        <ImageIcon className="w-3.5 h-3.5" /> Photo
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[11px]">None</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap space-x-1">
                    <button
                      onClick={() => onSelectReport(report)}
                      title="View Details"
                      className="p-1.5 bg-sky-600/20 hover:bg-sky-600 text-sky-300 hover:text-white rounded transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    {isAdmin && (
                      <>
                        <button
                          onClick={() => onVerify && onVerify(report.id)}
                          title="Verify Report"
                          className="p-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white rounded transition-colors"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onMarkSuspicious && onMarkSuspicious(report.id)}
                          title="Mark Suspicious"
                          className="p-1.5 bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-white rounded transition-colors"
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onReject && onReject(report.id)}
                          title="Reject Report"
                          className="p-1.5 bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white rounded transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="bg-slate-950 px-4 py-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <div>
          Showing <span className="font-semibold text-slate-200">{startIndex + 1}</span> to{' '}
          <span className="font-semibold text-slate-200">{Math.min(startIndex + pageSize, reports.length)}</span> of{' '}
          <span className="font-semibold text-slate-200">{reports.length}</span> reports
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1 rounded bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1 rounded bg-slate-900 border border-slate-800 hover:bg-slate-800 disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
