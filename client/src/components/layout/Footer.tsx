import React from 'react';

const Footer: React.FC = () => (
  <footer style={{
    marginTop: '8rem',
    paddingTop: '4rem',
    borderTop: '1px solid var(--color-border)',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '2.5rem',
    color: 'var(--color-text-faint)',
    fontSize: '10px',
    fontWeight: 900,
    textTransform: 'uppercase',
    letterSpacing: '0.4em',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'help' }}>
      <div style={{
        width: '0.5rem', height: '0.5rem',
        borderRadius: '50%',
        background: 'var(--color-emerald)',
        boxShadow: '0 0 10px rgba(16,185,129,0.5)',
      }} className="animate-pulse" />
      <span>Tactical Integrity: Optimal</span>
    </div>
    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '3rem' }}>
      <span>Full-Stack Engine v2.0</span>
      <span>Simulation: Multi-Agent</span>
    </div>
    <div style={{ color: 'var(--color-bg-elevated)' }}>
      &copy; 2025 LiveBid Tactical Systems &bull; DEPLOYED STABLE
    </div>
  </footer>
);

export default Footer;
