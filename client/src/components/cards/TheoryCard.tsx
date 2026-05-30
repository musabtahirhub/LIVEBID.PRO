import React from 'react';

interface TheoryCardProps {
  title: string;
  desc: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  color?: string;
}

const colorMap: Record<string, string> = {
  purple: 'var(--color-purple)',
  emerald: 'var(--color-emerald)',
  blue: 'var(--color-blue)',
};

const TheoryCard: React.FC<TheoryCardProps> = ({ title, desc, icon, children, color = 'purple' }) => (
  <div className="card card-xl group" style={{ position: 'relative', overflow: 'hidden' }}>
    <div style={{
      position: 'absolute', top: '-2.5rem', right: '-2.5rem',
      width: '12rem', height: '12rem',
      background: `${colorMap[color]}15`,
      filter: 'blur(80px)',
      borderRadius: '50%',
      transition: 'background var(--transition-base)',
    }} />
    <div style={{
      display: 'flex', alignItems: 'center', gap: '1.5rem',
      marginBottom: '2rem', position: 'relative', zIndex: 10,
    }}>
      <div style={{
        width: '4rem', height: '4rem',
        background: `${colorMap[color]}15`,
        borderRadius: 'var(--radius-xl)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: `1px solid ${colorMap[color]}30`,
        boxShadow: 'var(--shadow-card)',
      }}>
        {icon}
      </div>
      <h3 style={{
        fontSize: '1.875rem', fontWeight: 900,
        textTransform: 'uppercase', fontStyle: 'italic',
        letterSpacing: '-0.05em',
      }}>
        {title}
      </h3>
    </div>
    <p style={{
      color: 'var(--color-text-secondary)',
      fontSize: '0.875rem', fontWeight: 700,
      lineHeight: 1.6, marginBottom: '2.5rem',
      position: 'relative', zIndex: 10,
      textTransform: 'uppercase', letterSpacing: '0.1em',
    }}>
      {desc}
    </p>
    <div style={{ position: 'relative', zIndex: 10, width: '100%' }}>
      {children}
    </div>
  </div>
);

export default TheoryCard;
