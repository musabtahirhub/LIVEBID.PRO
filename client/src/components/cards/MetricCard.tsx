import React from 'react';

interface MetricCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  color: string;
}

const colorMap: Record<string, string> = {
  emerald: 'var(--color-emerald)',
  blue: 'var(--color-blue)',
  rose: 'var(--color-rose)',
  amber: 'var(--color-amber)',
  purple: 'var(--color-purple)',
  white: 'var(--color-text-primary)',
};

const MetricCard: React.FC<MetricCardProps> = ({ icon, label, value, sub, color }) => (
  <div className="card" style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}>
    <div style={{
      position: 'absolute', top: 0, left: 0, width: '100%', height: '4px',
      background: colorMap[color] || 'var(--color-emerald)',
      opacity: 0.2,
    }} />
    <div style={{
      fontSize: '9px', fontWeight: 900, color: 'var(--color-text-muted)',
      textTransform: 'uppercase', letterSpacing: '0.2em',
      marginBottom: '1rem',
      display: 'flex', alignItems: 'center', gap: '0.75rem',
    }}>
      <div style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-md)' }}>
        {icon}
      </div>
      {label}
    </div>
    <div style={{
      fontSize: '1.875rem', fontWeight: 900, fontStyle: 'italic',
      color: 'var(--color-text-primary)',
      lineHeight: 1, marginBottom: '0.5rem',
      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
    }}>
      {value}
    </div>
    <div style={{
      fontSize: '8px', color: 'var(--color-text-faint)',
      fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em',
    }}>
      {sub}
    </div>
  </div>
);

export default MetricCard;
