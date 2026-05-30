import React from 'react';
import {
  LineChart, Line, BarChart, Bar, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { GraduationCap, BrainCircuit, Gauge } from 'lucide-react';
import TheoryCard from '../components/cards/TheoryCard';

const TheoryLab: React.FC = () => {
  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '3rem', paddingBottom: '5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{
          width: '3.5rem', height: '3.5rem',
          background: 'rgba(168,85,247,0.1)',
          borderRadius: 'var(--radius-xl)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px solid rgba(168,85,247,0.2)',
          boxShadow: 'var(--shadow-card)',
        }}>
          <GraduationCap style={{ width: '2rem', height: '2rem', color: 'var(--color-purple)' }} />
        </div>
        <h2 style={{ fontSize: '2.25rem', fontWeight: 900, fontStyle: 'italic', textTransform: 'uppercase', letterSpacing: '-0.05em' }}>Theorem Playground</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))', gap: '3rem' }}>
        <TheoryCard
          title="Nash Equilibrium"
          desc="The strategy profile where no agent can benefit by changing their strategy. Our engine adjusts for Winner's Curse through stochastic offsets."
          icon={<BrainCircuit style={{ width: '2rem', height: '2rem', color: 'var(--color-purple)' }} />}
        >
          <div style={{ height: '16rem', marginTop: '2.5rem', width: '100%', position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[{ x: 1, y: 10 }, { x: 2, y: 15 }, { x: 3, y: 25 }, { x: 4, y: 40 }, { x: 5, y: 60 }]}>
                <Line type="monotone" dataKey="y" stroke="#a855f7" strokeWidth={5} dot={{ r: 6, fill: '#a855f7', stroke: '#0f172a', strokeWidth: 2 }} />
                <CartesianGrid stroke="#ffffff05" vertical={false} />
                <XAxis hide />
                <YAxis hide />
                <Tooltip contentStyle={{ display: 'none' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </TheoryCard>

        <TheoryCard
          title="Vickrey Logic"
          desc="A second-price auction mechanism designed for truthful information revelation. Bidders are incentivized to bid their 'true valuation' 100% of the time."
          icon={<Gauge style={{ width: '2rem', height: '2rem', color: 'var(--color-emerald)' }} />}
          color="emerald"
        >
          <div style={{ height: '16rem', marginTop: '2.5rem', width: '100%', position: 'relative' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[{ x: 'English', y: 72 }, { x: 'Vickrey', y: 100 }]}>
                <Bar dataKey="y" radius={[10, 10, 0, 0]}>
                  <Cell fill="#334155" />
                  <Cell fill="#10b981" />
                </Bar>
                <XAxis dataKey="x" axisLine={false} tickLine={false} fontSize={10} stroke="#475569" fontWeight="bold" />
                <YAxis hide />
                <Tooltip contentStyle={{ display: 'none' }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </TheoryCard>
      </div>
    </div>
  );
};

export default TheoryLab;
