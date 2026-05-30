import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AuctionProvider, useAuction } from './context/AuctionContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import WarRoom from './pages/WarRoom';
import GlobalFeed from './pages/GlobalFeed';
import AgentIntel from './pages/AgentIntel';
import TheoryLab from './pages/TheoryLab';
import History from './pages/History';

/**
 * Main terminal layout with header, tab content, and footer.
 */
const TerminalLayout: React.FC = () => {
  const { activeTab, setActiveTab } = useAuction();

  return (
    <div className="app-container">
      <div className="glow-emerald" />
      <div className="glow-blue" />

      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main style={{ minHeight: '700px' }}>
        {activeTab === 'WAR_ROOM' && <WarRoom />}
        {activeTab === 'GLOBAL_FEED' && <GlobalFeed />}
        {activeTab === 'AGENT_INTEL' && <AgentIntel />}
        {activeTab === 'THEORY_LAB' && <TheoryLab />}
        {activeTab === 'HISTORY' && <History />}
      </main>

      <Footer />
    </div>
  );
};

/**
 * Dashboard layout for authenticated user pages.
 */
const DashboardLayout: React.FC = () => {
  const { activeTab, setActiveTab } = useAuction();

  return (
    <div className="app-container">
      <div className="glow-emerald" />
      <div className="glow-blue" />

      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main style={{ minHeight: '700px' }}>
        <Dashboard />
      </main>

      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AuctionProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<DashboardLayout />} />
            <Route path="/*" element={<TerminalLayout />} />
          </Routes>
        </AuctionProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
