import React, { useEffect, useState } from 'react';
import { BarChart3, Gavel, Clock, TrendingUp, Target, DollarSign, AlertTriangle, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import MetricCard from '../components/cards/MetricCard';
import type { HistoryResponse, SimulationHistoryItem, UserBidItem, UserAuctionItem } from '../types';

type HistoryTab = 'simulations' | 'bids' | 'auctions';

const History: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [data, setData] = useState<HistoryResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<HistoryTab>('simulations');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    const fetchHistory = async () => {
      try {
        const result = await api.history.getAll();
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Failed to load history');
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, [isAuthenticated]);

  // ─── Not Authenticated ─────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '500px', gap: '2rem' }}>
        <div style={{
          width: '5rem', height: '5rem', borderRadius: '50%',
          background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <LogIn style={{ width: '2rem', height: '2rem', color: 'var(--color-emerald)' }} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, fontStyle: 'italic', textTransform: 'uppercase', letterSpacing: '-0.03em' }}>
            Access <span style={{ color: 'var(--color-emerald)' }}>Restricted</span>
          </h2>
          <p className="text-overline" style={{ marginTop: '0.75rem' }}>
            Sign in to view your operational history
          </p>
        </div>
      </div>
    );
  }

  // ─── Loading ────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.25rem' }}>
          {[1, 2, 3, 4, 5].map(i => <div key={i} className="skeleton" style={{ height: '7rem', borderRadius: 'var(--radius-3xl)' }} />)}
        </div>
        <div className="skeleton" style={{ height: '24rem', borderRadius: 'var(--radius-4xl)' }} />
      </div>
    );
  }

  // ─── Error ──────────────────────────────────────────────────
  if (error) {
    return (
      <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', gap: '1.5rem' }}>
        <AlertTriangle style={{ width: '3rem', height: '3rem', color: 'var(--color-rose)' }} />
        <p style={{ color: 'var(--color-rose)', fontWeight: 700 }}>{error}</p>
      </div>
    );
  }

  const stats = data?.stats;

  return (
    <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '2.25rem', fontWeight: 900, fontStyle: 'italic', textTransform: 'uppercase', letterSpacing: '-0.05em' }}>
          Operations <span style={{ color: 'var(--color-emerald)' }}>History</span>
        </h2>
        <p className="text-overline" style={{ marginTop: '0.5rem' }}>
          Complete record of your bidding terminal activity
        </p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.25rem' }}>
        <MetricCard
          icon={<BarChart3 />}
          label="Simulations"
          value={stats?.totalSimulations?.toString() || '0'}
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
          icon={<DollarSign />}
          label="Bids Placed"
          value={stats?.totalBids?.toString() || '0'}
          sub="Total Bids"
          color="amber"
        />
        <MetricCard
          icon={<Gavel />}
          label="Auctions"
          value={stats?.totalAuctions?.toString() || '0'}
          sub="Created"
          color="emerald"
        />
      </div>

      {/* Sub-Tab Navigation */}
      <div className="card card-xl" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.25rem', padding: '0.25rem', background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-xl)', alignSelf: 'flex-start' }}>
          {([
            { key: 'simulations' as HistoryTab, label: 'Simulations', count: data?.simulations.length || 0 },
            { key: 'bids' as HistoryTab, label: 'Bids', count: data?.bids.length || 0 },
            { key: 'auctions' as HistoryTab, label: 'Auctions', count: data?.auctions.length || 0 },
          ]).map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`nav-btn ${activeTab === tab.key ? 'active' : ''}`}
              style={{ gap: '0.5rem' }}
            >
              <span style={{ display: 'inline' }}>{tab.label}</span>
              <span style={{
                fontSize: '8px', fontWeight: 900, fontFamily: 'var(--font-mono)',
                padding: '0.15rem 0.4rem', borderRadius: '0.25rem',
                background: activeTab === tab.key ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.05)',
              }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'simulations' && <SimulationsView items={data?.simulations || []} />}
        {activeTab === 'bids' && <BidsView items={data?.bids || []} />}
        {activeTab === 'auctions' && <AuctionsView items={data?.auctions || []} />}
      </div>
    </div>
  );
};

// ─── Simulations Sub-View ────────────────────────────────────

const SimulationsView: React.FC<{ items: SimulationHistoryItem[] }> = ({ items }) => {
  if (items.length === 0) {
    return <EmptyState icon={<BarChart3 />} message="No simulations yet. Head to the War Room to run your first analysis." />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {/* Table Header */}
      <div style={{
        display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1.2fr',
        gap: '1rem', padding: '0.75rem 1.25rem',
      }}>
        <span className="text-micro" style={{ color: 'var(--color-text-muted)' }}>Asset</span>
        <span className="text-micro" style={{ color: 'var(--color-text-muted)', textAlign: 'center' }}>Market Value</span>
        <span className="text-micro" style={{ color: 'var(--color-text-muted)', textAlign: 'center' }}>Win Rate</span>
        <span className="text-micro" style={{ color: 'var(--color-text-muted)', textAlign: 'center' }}>Avg Price</span>
        <span className="text-micro" style={{ color: 'var(--color-text-muted)', textAlign: 'center' }}>Verdict</span>
        <span className="text-micro" style={{ color: 'var(--color-text-muted)', textAlign: 'right' }}>Date</span>
      </div>

      {items.map((sim, i) => (
        <div key={sim.id} className="animate-slide-up" style={{
          display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 1.2fr',
          gap: '1rem', alignItems: 'center',
          padding: '1.25rem', background: 'var(--color-bg-input)',
          borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)',
          animationDelay: `${i * 30}ms`, animationFillMode: 'backwards',
          transition: 'border-color var(--transition-base)',
        }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.3)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}
        >
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 900, fontStyle: 'italic' }}>{sim.auction_name}</div>
            <div className="text-micro" style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
              {sim.iterations} iterations · {sim.competition} competitors
            </div>
          </div>
          <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', fontWeight: 700 }}>
            ${sim.market_value.toLocaleString()}
          </div>
          <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 900, color: sim.win_rate > 0.5 ? 'var(--color-emerald)' : sim.win_rate > 0.3 ? 'var(--color-amber)' : 'var(--color-rose)' }}>
            {(sim.win_rate * 100).toFixed(1)}%
          </div>
          <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-text-secondary)' }}>
            ${sim.avg_win_price.toLocaleString()}
          </div>
          <div style={{ textAlign: 'center' }}>
            <span className={`badge ${sim.recommendation === 'Strong Buy' ? 'badge-emerald' : sim.recommendation === 'Avoid' ? 'badge-rose' : 'badge-muted'}`}>
              {sim.recommendation}
            </span>
          </div>
          <div className="text-micro" style={{ color: 'var(--color-text-muted)', textAlign: 'right' }}>
            {new Date(sim.created_at).toLocaleDateString()} {new Date(sim.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Bids Sub-View ───────────────────────────────────────────

const BidsView: React.FC<{ items: UserBidItem[] }> = ({ items }) => {
  if (items.length === 0) {
    return <EmptyState icon={<DollarSign />} message="No bids placed yet. Join an auction and start bidding." />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {/* Table Header */}
      <div style={{
        display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.2fr',
        gap: '1rem', padding: '0.75rem 1.25rem',
      }}>
        <span className="text-micro" style={{ color: 'var(--color-text-muted)' }}>Auction</span>
        <span className="text-micro" style={{ color: 'var(--color-text-muted)', textAlign: 'center' }}>Bid Amount</span>
        <span className="text-micro" style={{ color: 'var(--color-text-muted)', textAlign: 'center' }}>Status</span>
        <span className="text-micro" style={{ color: 'var(--color-text-muted)', textAlign: 'right' }}>Date</span>
      </div>

      {items.map((bid, i) => (
        <div key={bid.id} className="animate-slide-up" style={{
          display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.2fr',
          gap: '1rem', alignItems: 'center',
          padding: '1.25rem', background: 'var(--color-bg-input)',
          borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)',
          animationDelay: `${i * 30}ms`, animationFillMode: 'backwards',
          transition: 'border-color var(--transition-base)',
        }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.3)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}
        >
          <div style={{ fontSize: '0.875rem', fontWeight: 900, fontStyle: 'italic' }}>
            {bid.auction_name}
          </div>
          <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 900, color: 'var(--color-emerald)' }}>
            ${bid.amount.toLocaleString()}
          </div>
          <div style={{ textAlign: 'center' }}>
            <span className={`badge ${bid.auction_status === 'active' ? 'badge-emerald' : 'badge-muted'}`}>
              {bid.auction_status}
            </span>
          </div>
          <div className="text-micro" style={{ color: 'var(--color-text-muted)', textAlign: 'right' }}>
            {new Date(bid.created_at).toLocaleDateString()} {new Date(bid.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Auctions Sub-View ───────────────────────────────────────

const AuctionsView: React.FC<{ items: UserAuctionItem[] }> = ({ items }) => {
  if (items.length === 0) {
    return <EmptyState icon={<Gavel />} message="No auctions created yet. Create your first auction to get started." />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {/* Table Header */}
      <div style={{
        display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1.2fr',
        gap: '1rem', padding: '0.75rem 1.25rem',
      }}>
        <span className="text-micro" style={{ color: 'var(--color-text-muted)' }}>Auction Name</span>
        <span className="text-micro" style={{ color: 'var(--color-text-muted)', textAlign: 'center' }}>Market Value</span>
        <span className="text-micro" style={{ color: 'var(--color-text-muted)', textAlign: 'center' }}>Type</span>
        <span className="text-micro" style={{ color: 'var(--color-text-muted)', textAlign: 'center' }}>Status</span>
        <span className="text-micro" style={{ color: 'var(--color-text-muted)', textAlign: 'right' }}>Created</span>
      </div>

      {items.map((auction, i) => (
        <div key={auction.id} className="animate-slide-up" style={{
          display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1.2fr',
          gap: '1rem', alignItems: 'center',
          padding: '1.25rem', background: 'var(--color-bg-input)',
          borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)',
          animationDelay: `${i * 30}ms`, animationFillMode: 'backwards',
          transition: 'border-color var(--transition-base)',
        }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.3)')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--color-border)')}
        >
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 900, fontStyle: 'italic' }}>{auction.name}</div>
            {auction.house && (
              <div className="text-micro" style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
                {auction.house}
              </div>
            )}
          </div>
          <div style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', fontWeight: 700 }}>
            ${auction.market_value.toLocaleString()}
          </div>
          <div style={{ textAlign: 'center' }}>
            <span className="badge badge-muted">{auction.auction_type}</span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span className={`badge ${auction.status === 'active' ? 'badge-emerald' : 'badge-rose'}`}>
              {auction.status}
            </span>
          </div>
          <div className="text-micro" style={{ color: 'var(--color-text-muted)', textAlign: 'right' }}>
            {new Date(auction.created_at).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Empty State ─────────────────────────────────────────────

const EmptyState: React.FC<{ icon: React.ReactNode; message: string }> = ({ icon, message }) => (
  <div style={{ padding: '4rem 0', textAlign: 'center', opacity: 0.3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
    <div style={{ width: '3rem', height: '3rem' }}>{icon}</div>
    <p className="text-label">{message}</p>
  </div>
);

export default History;
