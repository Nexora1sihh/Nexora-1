export type VerificationStatus = 'Verified' | 'Pending' | 'Suspicious' | 'Under Review' | 'Rejected';

export type EventCategory = 
  | 'Heavy Rainfall' 
  | 'Flooding' 
  | 'Thunderstorm' 
  | 'Heatwave' 
  | 'Fog' 
  | 'Dust Storm' 
  | 'Strong Wind' 
  | 'Other';

export interface ExplainableConfidence {
  source_credibility: number;
  cross_source_agreement: number;
  location_consistency: number;
  time_consistency: number;
  media_consistency: number;
  overall_confidence: number;
}

export interface WeatherReport {
  id: string;
  source: string;
  source_type: string;
  timestamp: string;
  description: string;
  event_category: EventCategory;
  secondary_category?: string;
  city: string;
  state: string;
  district?: string;
  latitude: number;
  longitude: number;
  hashtags?: string;
  verification_status: VerificationStatus;
  confidence_score: number;
  trust_score: number;
  explainable_confidence?: ExplainableConfidence;
  image_url?: string;
  video_url?: string;
  is_duplicate?: boolean;
  duplicate_of_id?: string;
  created_at: string;
  updated_at: string;
}

export interface WeatherEvent {
  id: string;
  event_type: EventCategory;
  severity: 'Low' | 'Moderate' | 'High' | 'Severe' | 'Extreme';
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  start_time: string;
  last_updated: string;
  confidence: number;
  verification_status: VerificationStatus;
  report_count: number;
  summary?: string;
}

export interface AnalyticsSummary {
  total_reports: number;
  verified_reports: number;
  pending_reports: number;
  suspicious_reports: number;
  rejected_reports: number;
  under_review_reports: number;
  active_events: number;
  last_24h_reports: number;
}

export interface DataSource {
  id: string;
  name: string;
  source_type: string;
  trust_score: number;
  is_verified: boolean;
  total_reports: number;
  last_active: string;
}

export interface SystemServiceInfo {
  status: string;
  mode?: string;
  topic?: string;
  port?: number;
  type?: string;
}

export interface SystemStatus {
  status: string;
  platform: string;
  short_name: string;
  tagline: string;
  version: string;
  services: Record<string, SystemServiceInfo>;
  telemetry: {
    stored_reports: number;
    tracked_events: number;
    demo_mode: boolean;
  };
}

export interface FilterState {
  dateFilter: string;
  eventCategory: string;
  state: string;
  city: string;
  verificationStatus: string;
  searchQuery: string;
}
