import axios from 'axios';
import { WeatherReport, WeatherEvent, AnalyticsSummary, DataSource, SystemStatus, FilterState } from '../types';

const API_BASE_URL = '/api';

export const api = {
  // Reports
  getReports: async (filters?: Partial<FilterState>): Promise<WeatherReport[]> => {
    const params: Record<string, string> = {};
    if (filters?.dateFilter && filters.dateFilter !== 'All') params.date_filter = filters.dateFilter;
    if (filters?.eventCategory && filters.eventCategory !== 'All') params.event = filters.eventCategory;
    if (filters?.state && filters.state !== 'All') params.state = filters.state;
    if (filters?.city && filters.city !== 'All') params.city = filters.city;
    if (filters?.verificationStatus && filters.verificationStatus !== 'All') params.verification = filters.verificationStatus;
    if (filters?.searchQuery) params.search = filters.searchQuery;

    const res = await axios.get(`${API_BASE_URL}/reports`, { params });
    return res.data;
  },

  getReportById: async (id: string): Promise<WeatherReport> => {
    const res = await axios.get(`${API_BASE_URL}/reports/${id}`);
    return res.data;
  },

  verifyReport: async (id: string, category?: string): Promise<WeatherReport> => {
    const res = await axios.put(`${API_BASE_URL}/reports/${id}/verify`, { category });
    return res.data;
  },

  rejectReport: async (id: string): Promise<WeatherReport> => {
    const res = await axios.put(`${API_BASE_URL}/reports/${id}/reject`);
    return res.data;
  },

  markSuspiciousReport: async (id: string): Promise<WeatherReport> => {
    const res = await axios.put(`${API_BASE_URL}/reports/${id}/suspicious`);
    return res.data;
  },

  // Events
  getEvents: async (): Promise<WeatherEvent[]> => {
    const res = await axios.get(`${API_BASE_URL}/events`);
    return res.data;
  },

  // Citizen Report Submission
  submitCitizenReport: async (data: {
    name?: string;
    description: string;
    event_category: string;
    city: string;
    state: string;
    latitude: number;
    longitude: number;
    hashtags?: string;
    image_url?: string;
  }): Promise<WeatherReport> => {
    const res = await axios.post(`${API_BASE_URL}/citizen-report`, data);
    return res.data;
  },

  // Analytics
  getAnalyticsSummary: async (): Promise<AnalyticsSummary> => {
    const res = await axios.get(`${API_BASE_URL}/analytics/summary`);
    return res.data;
  },

  getTimelineAnalytics: async (): Promise<{ date: string; count: number }[]> => {
    const res = await axios.get(`${API_BASE_URL}/analytics/timeline`);
    return res.data;
  },

  getEventsAnalytics: async (): Promise<{ category: string; count: number }[]> => {
    const res = await axios.get(`${API_BASE_URL}/analytics/events`);
    return res.data;
  },

  getLocationAnalytics: async (): Promise<{ by_state: { state: string; count: number }[]; by_city: { city: string; count: number }[] }> => {
    const res = await axios.get(`${API_BASE_URL}/analytics/locations`);
    return res.data;
  },

  getSourceDistribution: async (): Promise<{ source_type: string; count: number }[]> => {
    const res = await axios.get(`${API_BASE_URL}/analytics/sources`);
    return res.data;
  },

  // Sources & System
  getSources: async (): Promise<DataSource[]> => {
    const res = await axios.get(`${API_BASE_URL}/sources`);
    return res.data;
  },

  getSystemStatus: async (): Promise<SystemStatus> => {
    const res = await axios.get(`${API_BASE_URL}/system/status`);
    return res.data;
  },

  // Demo Simulations
  simulateReport: async (): Promise<WeatherReport> => {
    const res = await axios.post(`${API_BASE_URL}/demo/simulate-report`);
    return res.data;
  },

  simulateFlood: async (): Promise<WeatherReport> => {
    const res = await axios.post(`${API_BASE_URL}/demo/simulate-flood`);
    return res.data;
  },

  simulateStorm: async (): Promise<WeatherReport> => {
    const res = await axios.post(`${API_BASE_URL}/demo/simulate-storm`);
    return res.data;
  }
};
