import React from 'react';

interface RiskItemProps {
  label: string;
  risk: string;
  action: string;
}

const RiskItem: React.FC<RiskItemProps> = ({ label, risk, action }) => (
  <li className="card-compact" style={{
    listStyle: 'none',
    background: 'rgba(2, 6, 23, 0.5)',
  }}>
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em',
    }}>
      <span style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
      <span style={{
        color: risk === 'Critical' ? 'var(--color-rose)' : risk === 'Moderate' ? 'var(--color-amber)' : 'var(--color-emerald)',
      }}>
        {risk} Risk
      </span>
    </div>
    <p style={{
      fontSize: '10px', color: 'var(--color-text-faint)',
      fontWeight: 700, textTransform: 'uppercase', lineHeight: 1.6, marginTop: '0.5rem',
    }}>
      {action}
    </p>
  </li>
);

export default RiskItem;
