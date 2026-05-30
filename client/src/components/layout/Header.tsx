import React from 'react';
import { Zap, LogOut, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import NavButton from './NavButton';
import type { Tab } from '../../types';

interface HeaderProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
      marginBottom: '3rem',
      borderBottom: '1px solid var(--color-border)',
      paddingBottom: '2.5rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute', inset: 0,
              background: 'var(--color-emerald)',
              filter: 'blur(2rem)',
              opacity: 0.1,
            }} className="animate-pulse" />
            <div style={{
              position: 'relative',
              width: '3.5rem', height: '3.5rem',
              background: 'linear-gradient(135deg, #34d399, #059669)',
              borderRadius: 'var(--radius-xl)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'var(--shadow-card)',
            }}>
              <Zap style={{ width: '1.75rem', height: '1.75rem', color: 'var(--color-bg-primary)', fill: 'currentColor' }} />
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <h1 style={{
                fontSize: '1.875rem', fontWeight: 900,
                letterSpacing: '-0.05em',
                textTransform: 'uppercase',
                fontStyle: 'italic',
              }}>
                Live<span style={{ color: 'var(--color-emerald)' }}>Bid</span>.Pro
              </h1>
              <span className="badge badge-muted" style={{ display: 'none' }}>COMBAT v4.5</span>
            </div>
            <p className="text-overline" style={{ marginTop: '0.25rem' }}>
              High-Stakes Auction Bidding Terminal
            </p>
          </div>
        </div>

        {/* User Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isAuthenticated ? (
            <>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.5rem 1rem',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)',
              }}>
                <User style={{ width: '0.875rem', height: '0.875rem', color: 'var(--color-emerald)' }} />
                <span style={{ fontSize: '0.6875rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-secondary)' }}>
                  {user?.username}
                </span>
              </div>
              <button onClick={handleLogout} className="btn btn-ghost" style={{ padding: '0.5rem 1rem' }}>
                <LogOut style={{ width: '0.875rem', height: '0.875rem' }} />
              </button>
            </>
          ) : (
            <button onClick={() => navigate('/login')} className="btn btn-secondary" style={{ padding: '0.5rem 1.5rem' }}>
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="nav-container" style={{ alignSelf: 'flex-start' }}>
        <NavButton active={activeTab === 'WAR_ROOM'} onClick={() => onTabChange('WAR_ROOM')} label="War Room" tabId="WAR_ROOM" />
        <NavButton active={activeTab === 'GLOBAL_FEED'} onClick={() => onTabChange('GLOBAL_FEED')} label="Global Feed" tabId="GLOBAL_FEED" />
        <NavButton active={activeTab === 'AGENT_INTEL'} onClick={() => onTabChange('AGENT_INTEL')} label="Agent Intel" tabId="AGENT_INTEL" />
        <NavButton active={activeTab === 'THEORY_LAB'} onClick={() => onTabChange('THEORY_LAB')} label="Theory Lab" tabId="THEORY_LAB" />
        <NavButton active={activeTab === 'HISTORY'} onClick={() => onTabChange('HISTORY')} label="History" tabId="HISTORY" />
      </nav>
    </header>
  );
};

export default Header;
