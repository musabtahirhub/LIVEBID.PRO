import React from 'react';
import { Globe, ExternalLink, RefreshCcw, ArrowRight } from 'lucide-react';
import { useAuction } from '../context/AuctionContext';
import type { RealAuction } from '../types';

const GlobalFeed: React.FC = () => {
  const { trendingAuctions, isLoadingAuctions, fetchAuctions, selectAuction } = useAuction();

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 900, fontStyle: 'italic', textTransform: 'uppercase', letterSpacing: '-0.05em' }}>Global Discovery</h2>
          <p className="text-overline" style={{ marginTop: '0.5rem' }}>Live Multi-Exchange Market Indexes</p>
        </div>
        <button onClick={fetchAuctions} className="btn btn-secondary" id="btn-scan-networks">
          <RefreshCcw style={{ width: '1rem', height: '1rem' }} className={isLoadingAuctions ? 'animate-spin' : ''} />
          Scan Networks
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem', paddingBottom: '5rem' }}>
        {isLoadingAuctions
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: '20rem', borderRadius: 'var(--radius-3xl)' }} />
            ))
          : trendingAuctions.map((auc: RealAuction, idx: number) => (
              <div key={idx} className="card card-xl group transition-all hover-border-emerald hover-lift" style={{ cursor: 'pointer' }}>
                <div style={{ position: 'absolute', top: 0, right: 0, padding: '2rem', opacity: 0.03, pointerEvents: 'none' }}>
                  <Globe style={{ width: '8rem', height: '8rem' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', position: 'relative', zIndex: 10 }}>
                  <span className="badge badge-emerald">Active Lot</span>
                  <div style={{
                    padding: '0.75rem', background: 'rgba(255,255,255,0.03)',
                    borderRadius: 'var(--radius-xl)',
                    transition: 'all var(--transition-base)',
                  }}>
                    <ExternalLink style={{ width: '1rem', height: '1rem' }} />
                  </div>
                </div>
                <h4 style={{
                  fontSize: '1.5rem', fontWeight: 900, marginBottom: '1rem', lineHeight: 1.2,
                  height: '4rem', overflow: 'hidden',
                  textTransform: 'uppercase', fontStyle: 'italic', letterSpacing: '-0.05em',
                  transition: 'color var(--transition-base)',
                }}>
                  {auc.name}
                </h4>
                <div style={{ paddingTop: '2rem', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div>
                    <span className="text-overline" style={{ display: 'block', marginBottom: '0.25rem' }}>Origin House</span>
                    <span style={{ fontSize: '1rem', fontWeight: 900, fontStyle: 'italic', textTransform: 'uppercase', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block', maxWidth: '8rem' }}>{auc.house}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="text-overline" style={{ display: 'block', marginBottom: '0.25rem' }}>Est. Valuation</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--color-emerald)', fontFamily: 'var(--font-mono)' }}>
                      ${auc.estimatedValue.toLocaleString()}
                    </span>
                  </div>
                </div>
                <button onClick={() => selectAuction(auc)} className="btn btn-ghost btn-full" style={{ marginTop: '2.5rem' }} id={`btn-engage-${idx}`}>
                  Engage War Room
                  <ArrowRight style={{ width: '1rem', height: '1rem' }} />
                </button>
              </div>
            ))}
      </div>
    </div>
  );
};

export default GlobalFeed;
