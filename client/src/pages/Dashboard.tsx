import React, { useEffect, useState } from 'react';
import { BarChart3, Clock, Target, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import MetricCard from '../components/cards/MetricCard';

const Dashboard: React.FC = () => {
  const { user, stats } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await api.simulation.getHistory();
        setHistory(data.history || []);
      } catch {
        // Silently fail
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '2.25rem', fontWeight: 900, fontStyle: 'italic', textTransform: 'uppercase', letterSpacing: '-0.05em' }}>
          Operator <span style={{ color: 'var(--color-emerald)' }}>Dashboard</span>
        </h2>
        <p className="text-overline" style={{ marginTop: '0.5rem' }}>
          Welcome back, {user?.username || 'Operator'}
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.25rem' }}>
        <MetricCard
          icon={<BarChart3 />}
          label="Simulations"
          value={stats?.total?.toString() || '0'}
          sub="Total Runs"
          color="emerald"
        />
        <MetricCard
          icon={<Target />}
          label="Avg Win Rate"
          value={stats?.avgWinRate ? `${(stats.avgWinRate * 100).toFixed(1)}%` : '0%'}
          sub="Mean Probability"
          color="blue"
        />
        <MetricCard
          icon={<TrendingUp />}
          label="Best Win Rate"
          value={stats?.bestWinRate ? `${(stats.bestWinRate * 100).toFixed(1)}%` : '0%'}
          sub="Peak Performance"
          color="purple"
        />
        <MetricCard
          icon={<Clock />}
          label="Member Since"
          value={user?.created_at ? new Date(user.created_at).toLocaleDateString() : '--'}
          sub="Account Created"
          color="amber"
        />
      </div>

      {/* Simulation History */}
      <div className="card card-xl" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-secondary)' }}>
          Simulation History
        </h3>

        {isLoading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[1, 2, 3].map(i => <div key={i} className="skeleton" style={{ height: '4rem', borderRadius: 'var(--radius-lg)' }} />)}
          </div>
        ) : history.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {history.map((sim: any) => (
              <div key={sim.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
                padding: '1.25rem', background: 'var(--color-bg-input)',
                borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)',
              }}>
                <div style={{ flex: 1, minWidth: '150px' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 900, fontStyle: 'italic' }}>{sim.auction_name}</div>
                  <div className="text-micro" style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                    {new Date(sim.created_at).toLocaleString()}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div className="text-micro" style={{ color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Win Rate</div>
                    <div style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--color-emerald)', fontFamily: 'var(--font-mono)' }}>
                      {(sim.win_rate * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div className="text-micro" style={{ color: 'var(--color-text-muted)', marginBottom: '0.25rem' }}>Verdict</div>
                    <span className={`badge ${sim.recommendation === 'Strong Buy' ? 'badge-emerald' : sim.recommendation === 'Avoid' ? 'badge-rose' : 'badge-muted'}`}>
                      {sim.recommendation}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ padding: '4rem 0', textAlign: 'center', opacity: 0.3 }}>
            <BarChart3 style={{ width: '3rem', height: '3rem', margin: '0 auto 1rem' }} />
            <p className="text-label">No simulations yet. Head to the War Room to run your first analysis.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
