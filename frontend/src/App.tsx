import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SimulationBar } from './components/SimulationBar';
import { Dashboard } from './pages/Dashboard';
import { LiveMapPage } from './pages/LiveMapPage';
import { EventsPage } from './pages/EventsPage';
import { CitizenReportPage } from './pages/CitizenReportPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SourcesPage } from './pages/SourcesPage';
import { AdminPage } from './pages/AdminPage';
import { ArchitecturePage } from './pages/ArchitecturePage';
import { wsService } from './services/websocket';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    wsService.connect();
    setIsConnected(true);

    const unsubscribe = wsService.subscribe((msg) => {
      console.log('⚡ WebSocket Live Message Received:', msg);
      // Trigger UI refresh when new report or status update arrives
      if (['NEW_REPORT', 'REPORT_VERIFIED', 'REPORT_REJECTED', 'REPORT_SUSPICIOUS'].includes(msg.type)) {
        setRefreshKey((prev) => prev + 1);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard key={refreshKey} searchQuery={searchQuery} />;
      case 'map':
        return <LiveMapPage key={refreshKey} />;
      case 'events':
        return <EventsPage key={refreshKey} />;
      case 'citizen':
        return <CitizenReportPage key={refreshKey} />;
      case 'analytics':
        return <AnalyticsPage key={refreshKey} />;
      case 'sources':
        return <SourcesPage key={refreshKey} />;
      case 'admin':
        return <AdminPage key={refreshKey} />;
      case 'architecture':
        return <ArchitecturePage key={refreshKey} />;
      default:
        return <Dashboard key={refreshKey} searchQuery={searchQuery} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isConnected={isConnected}
      />

      <SimulationBar onSimulationTriggered={() => setRefreshKey((prev) => prev + 1)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderActivePage()}
      </main>

      <footer className="bg-slate-900 border-t border-slate-800 py-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © 2026 <strong>National Weather Intelligence Platform (NWIP)</strong> • Real-Time Multi-Source Weather Intelligence & Verification
          </span>
          <span className="text-slate-400">
            Built for India Weather Big Data Analytics Platform Hackathon
          </span>
        </div>
      </footer>
    </div>
  );
};
