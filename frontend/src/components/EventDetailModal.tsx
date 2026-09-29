import React from 'react';
import { WeatherReport } from '../types';
import { VerificationBadge } from './VerificationBadge';
import { 
  X, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Tag, 
  ShieldCheck, 
  Share2, 
  Copy, 
  Brain,
  Info
} from 'lucide-react';

interface Props {
  report: WeatherReport | null;
  onClose: () => void;
  onVerify?: (id: string) => void;
  onReject?: (id: string) => void;
  onMarkSuspicious?: (id: string) => void;
}

export const EventDetailModal: React.FC<Props> = ({
  report,
  onClose,
  onVerify,
  onReject,
  onMarkSuspicious
}) => {
  if (!report) return null;

  const exp = report.explainable_confidence || {
    source_credibility: Math.round(report.confidence_score * 90),
    cross_source_agreement: Math.round(report.confidence_score * 95),
    location_consistency: 95,
    time_consistency: 92,
    media_consistency: report.image_url ? 88 : 65,
    overall_confidence: Math.round(report.confidence_score * 100)
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono font-bold text-sky-400 text-sm">{report.id}</span>
            <VerificationBadge status={report.verification_status} size="md" />
            {report.is_duplicate && (
              <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Possible Duplicate ({report.duplicate_of_id})
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Main Summary Card */}
          <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                  {report.event_category}
                  {report.secondary_category && (
                    <span className="text-xs font-normal text-slate-400">
                      (+ {report.secondary_category})
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-400 flex items-center gap-2 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-sky-400" /> {report.city}, {report.state} (GPS: {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)})
                  • <Clock className="w-3.5 h-3.5 text-sky-400" /> {new Date(report.timestamp).toLocaleString('en-IN')}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-sky-400">
                  {Math.round(report.confidence_score * 100)}%
                </div>
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  AI Confidence Score
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800">
              "{report.description}"
            </p>

            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 bg-slate-800 text-slate-300 rounded-md font-medium border border-slate-700">
                Source: {report.source} ({report.source_type})
              </span>
              {report.hashtags?.split(',').map((tag, i) => (
                <span key={i} className="px-2.5 py-1 bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-md font-mono">
                  {tag.trim()}
                </span>
              ))}
            </div>
          </div>

          {/* Media Attachments */}
          {report.image_url && (
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                Uploaded Weather Media Evidence
              </h4>
              <div className="rounded-xl overflow-hidden border border-slate-800 max-h-72">
                <img src={report.image_url} alt="Weather evidence" className="w-full h-full object-cover" />
              </div>
            </div>
          )}

          {/* Explainable Confidence Breakdown */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-sky-400" /> Explainable AI Verification & Trust Score Breakdown
            </h4>

            <div className="space-y-2.5">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-400">Source Credibility ({report.source_type})</span>
                  <span className="text-slate-200">{exp.source_credibility}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-sky-500 h-full rounded-full transition-all" style={{ width: `${exp.source_credibility}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-400">Cross-Source Agreement & Proximity Match</span>
                  <span className="text-slate-200">{exp.cross_source_agreement}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${exp.cross_source_agreement}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-400">Location & Bounding Box Consistency</span>
                  <span className="text-slate-200">{exp.location_consistency}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full transition-all" style={{ width: `${exp.location_consistency}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-slate-400">Timestamp Recency & Time Alignment</span>
                  <span className="text-slate-200">{exp.time_consistency}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-cyan-500 h-full rounded-full transition-all" style={{ width: `${exp.time_consistency}%` }}></div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">Overall Calculated Verification Score:</span>
              <span className="font-bold text-sky-400 text-sm">{exp.overall_confidence}%</span>
            </div>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {onVerify && (
              <button
                onClick={() => { onVerify(report.id); onClose(); }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" /> Verify Report
              </button>
            )}
            {onMarkSuspicious && (
              <button
                onClick={() => { onMarkSuspicious(report.id); onClose(); }}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
              >
                <AlertTriangle className="w-4 h-4" /> Mark Suspicious
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
