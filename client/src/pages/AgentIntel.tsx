import React from 'react';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';
import { Users, Cpu, BrainCircuit, Radar } from 'lucide-react';
import { useAuction } from '../context/AuctionContext';

const BIDDERS = [
  { id: '1', name: 'Venture Victor', personality: 'Aggressive Growth', description: 'Bids high and fast, looking for dominance at any cost.', trueValueBase: 1200, riskAversion: 0.1 },
  { id: '2', name: 'Cautious Clara', personality: 'Conservative Investor', description: 'Strictly adheres to budget. Rarely overbids.', trueValueBase: 950, riskAversion: 0.9 },
  { id: '3', name: 'Mathematical Max', personality: 'Rational Optimizer', description: 'Attempts to find the Nash Equilibrium in every round.', trueValueBase: 1100, riskAversion: 0.5 },
  { id: '4', name: 'Speculative Sam', personality: 'Wildcard Gambler', description: 'Value fluctuates wildly. Prone to irrational bidding.', trueValueBase: 1050, riskAversion: 0.3 },
  { id: '5', name: 'Hedge Fund Harry', personality: 'Deep Pockets', description: 'Aims to price out competitors through sheer volume.', trueValueBase: 1300, riskAversion: 0.2 },
];

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

const AgentIntel: React.FC = () => {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{
          width: '3.5rem', height: '3.5rem',
          background: 'rgba(59,130,246,0.1)',
          borderRadius: 'var(--radius-xl)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid rgba(59,130,246,0.2)',
          boxShadow: 'var(--shadow-card)',
        }}>
          <Users style={{ width: '1.75rem', height: '1.75rem', color: 'var(--color-blue-light)' }} />
        </div>
        <h2 style={{ fontSize: '2.25rem', fontWeight: 900, fontStyle: 'italic', textTransform: 'uppercase', letterSpacing: '-0.05em' }}>Neural Intelligence</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2.5rem' }}>
        <style>{`@media (min-width: 1024px) { .intel-grid { grid-template-columns: 8fr 4fr !important; } }`}</style>
        <div className="intel-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2.5rem' }}>
          {/* AGENT CARDS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
            {BIDDERS.map(b => (
              <div key={b.id} className="card card-xl group transition-all hover-border-blue" style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, right: 0, padding: '2rem', opacity: 0.02, pointerEvents: 'none' }}>
                  <BrainCircuit style={{ width: '8rem', height: '8rem' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '2rem', position: 'relative', zIndex: 10 }}>
                  <div style={{
                    width: '3.5rem', height: '3.5rem',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: 'var(--radius-xl)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--color-blue-light)',
                    transition: 'all var(--transition-base)',
                  }}>
                    <Cpu style={{ width: '1.75rem', height: '1.75rem' }} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.25rem', fontWeight: 900, fontStyle: 'italic', textTransform: 'uppercase', letterSpacing: '-0.05em' }}>{b.name}</h4>
                    <span style={{ fontSize: '9px', fontWeight: 900, color: 'var(--color-blue)', textTransform: 'uppercase', letterSpacing: '0.15em' }}>{b.personality}</span>
                  </div>
                </div>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem', fontWeight: 700, lineHeight: 1.6, marginBottom: '2rem', height: '3rem', overflow: 'hidden', position: 'relative', zIndex: 10 }}>{b.description}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', paddingTop: '2rem', borderTop: '1px solid var(--color-border)', position: 'relative', zIndex: 10 }}>
                  <div>
                    <span className="text-overline" style={{ display: 'block', marginBottom: '0.25rem' }}>Base Value</span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 900, fontFamily: 'var(--font-mono)', letterSpacing: '-0.05em', fontStyle: 'italic' }}>${b.trueValueBase}</span>
                  </div>
                  <div>
                    <span className="text-overline" style={{ display: 'block', marginBottom: '0.25rem' }}>Risk Tolerance</span>
                    <span style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--color-blue)', fontFamily: 'var(--font-mono)', letterSpacing: '-0.05em', fontStyle: 'italic' }}>{(b.riskAversion * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* SCATTER PLOT */}
          <div className="card card-xl" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <h3 className="text-label" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Radar style={{ width: '1.25rem', height: '1.25rem', color: 'var(--color-blue)' }} />
              Behavioral Scatter
            </h3>
            <div style={{ height: '480px', width: '100%', position: 'relative' }}>
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" />
                  <XAxis type="number" dataKey="risk" name="Risk" unit="%" stroke="#475569" fontSize={9} axisLine={false} tickLine={false} />
                  <YAxis type="number" dataKey="value" name="Value" unit="$" stroke="#475569" fontSize={9} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px' }} />
                  <Scatter data={BIDDERS.map(b => ({ name: b.name, risk: b.riskAversion * 100, value: b.trueValueBase }))}>
                    {BIDDERS.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            <div style={{ padding: '1.5rem', background: 'rgba(2,6,23,0.5)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)', textAlign: 'center' }}>
              <p className="text-overline">Cross-correlated behavioral analysis across the active neural node field.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentIntel;
