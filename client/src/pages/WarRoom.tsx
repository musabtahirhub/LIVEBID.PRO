import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ComposedChart, Bar, Line,
} from 'recharts';
import {
  Play, Cpu, Coins, ShieldCheck, Target, Clock,
  ListFilter, Flame, Sword, Zap, BrainCircuit, Skull,
  ShieldAlert, Globe, ExternalLink, Crosshair, Fingerprint,
  Radar, Activity, TrendingUp,
} from 'lucide-react';
import { useAuction } from '../context/AuctionContext';
import MetricCard from '../components/cards/MetricCard';
import RiskItem from '../components/cards/RiskItem';
import type { Bidder } from '../types';

const WarRoom: React.FC = () => {
  const {
    itemName, setItemName,
    marketValue, setMarketValue,
    personalValue, setPersonalValue,
    competition, setCompetition,
    userBid, isAnalyzing,
    strategyReport, groundingSources,
    simData, profitData,
    rec, logs, marketHeat,
    activeBidders,
    runAnalysis, handleManualBid,
    scrollRef,
  } = useAuction();

  const estimatedOpeningBid = strategyReport?.match(/\$\d+(?:,\d+)?/)?.[0] || `$${(marketValue * 0.75).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

  return (
    <div className="animate-slide-up" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2.5rem' }}>
      <style>{`
        @media (min-width: 1024px) {
          .war-room-grid { grid-template-columns: 4fr 8fr !important; }
        }
      `}</style>
      <div className="war-room-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2.5rem' }}>
        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* TARGETING PROFILE */}
          <section className="card card-xl" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 className="text-label" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <ListFilter style={{ width: '1rem', height: '1rem', color: 'var(--color-emerald)' }} />
                Targeting Profile
              </h3>
              {strategyReport && <Flame style={{ width: '1rem', height: '1rem', color: marketHeat > 70 ? 'var(--color-rose)' : 'var(--color-amber)' }} className={marketHeat > 70 ? 'animate-bounce' : ''} />}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Asset Identifier</label>
                <input
                  type="text" value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="input"
                  id="input-asset-name"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem' }}>Fair Market</label>
                  <input
                    type="number" value={marketValue}
                    onChange={(e) => setMarketValue(Number(e.target.value))}
                    className="input"
                    id="input-market-value"
                  />
                </div>
                <div>
                  <label className="text-label" style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--color-emerald)' }}>Hard Limit</label>
                  <input
                    type="number" value={personalValue}
                    onChange={(e) => setPersonalValue(Number(e.target.value))}
                    className="input input-emerald"
                    id="input-personal-value"
                  />
                </div>
              </div>

              <div style={{ padding: '1.5rem', background: 'rgba(2,6,23,0.5)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)' }}>
                <label className="text-label" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  Competitor Density
                  <span style={{ color: 'var(--color-emerald)', fontFamily: 'var(--font-mono)' }}>{competition} NODES</span>
                </label>
                <input
                  type="range" min="1" max="5" value={competition}
                  onChange={(e) => setCompetition(Number(e.target.value))}
                  className="range-slider"
                  id="slider-competition"
                />
              </div>

              <button
                onClick={runAnalysis}
                disabled={isAnalyzing}
                className="btn btn-primary btn-full btn-xl"
                id="btn-execute-analysis"
              >
                {isAnalyzing ? <Cpu style={{ width: '1.5rem', height: '1.5rem' }} className="animate-spin" /> : <Play style={{ width: '1.25rem', height: '1.25rem', fill: 'currentColor' }} />}
                {isAnalyzing ? 'Synchronizing Nodes...' : 'Execute Analysis'}
              </button>
            </div>
          </section>

          {/* COMBAT CONSOLE */}
          {strategyReport && (
            <section className="card card-xl animate-scale-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h4 className="text-label" style={{ color: 'var(--color-emerald)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Sword style={{ width: '1rem', height: '1rem' }} />
                  Combat Console
                </h4>
                <span className="badge badge-emerald">Live Input</span>
              </div>
              <div style={{
                background: 'var(--color-bg-input)', padding: '1.5rem',
                borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)',
                textAlign: 'center',
              }}>
                <div className="text-label" style={{ marginBottom: '0.5rem' }}>Your Current Position</div>
                <div style={{ fontSize: '2.25rem', fontWeight: 900, fontStyle: 'italic', color: 'var(--color-emerald)', fontFamily: 'var(--font-mono)', letterSpacing: '-0.05em' }}>
                  ${userBid.toLocaleString()}
                </div>
                <div style={{
                  fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', marginTop: '0.75rem',
                  padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)', display: 'inline-block',
                  background: userBid > personalValue ? 'rgba(244,63,94,0.2)' : 'rgba(255,255,255,0.05)',
                  color: userBid > personalValue ? 'var(--color-rose)' : 'var(--color-text-muted)',
                }}>
                  {userBid > personalValue ? 'LIMIT EXCEEDED' : 'WITHIN THRESHOLD'}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <button onClick={() => handleManualBid(50)} className="btn btn-ghost" id="btn-bid-50">+ $50</button>
                <button onClick={() => handleManualBid(250)} className="btn btn-ghost" id="btn-bid-250">+ $250</button>
                <button onClick={() => handleManualBid(500)} className="btn btn-secondary" style={{ gridColumn: 'span 2' }} id="btn-bid-500">
                  <Zap style={{ width: '0.75rem', height: '0.75rem' }} /> Jump Bid $500
                </button>
              </div>
            </section>
          )}

          {/* MARKET HEAT */}
          <section className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="text-label">Market Heat Index</span>
              <span className="text-label" style={{ color: marketHeat > 70 ? 'var(--color-rose)' : 'var(--color-emerald)' }}>{marketHeat}%</span>
            </div>
            <div className="progress-bar">
              <div className={`progress-fill ${marketHeat > 70 ? 'progress-rose' : marketHeat > 40 ? 'progress-amber' : 'progress-emerald'}`} style={{ width: `${marketHeat}%` }} />
            </div>
            <p style={{ fontSize: '9px', color: 'var(--color-text-muted)', fontWeight: 700, textTransform: 'uppercase', lineHeight: 1.6, textAlign: 'center', fontStyle: 'italic' }}>
              {marketHeat > 70 ? 'Warning: Aggressive FOMO detected. Retract manual input.' : 'Market remains stable. Opportunity window remains open.'}
            </p>
          </section>

          {/* TACTICAL LOG */}
          <section className="card-compact" style={{ background: 'rgba(15,23,42,0.3)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-2xl)', padding: '1.5rem' }}>
            <div ref={scrollRef} style={{ height: '10rem', overflowY: 'auto', paddingRight: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--color-text-muted)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {logs.length > 0 ? logs.map((log: string, i: number) => (
                <div key={i} className="animate-slide-in-left" style={{ display: 'flex', gap: '0.75rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.25rem' }}>
                  <span style={{ color: 'rgba(16,185,129,0.3)', flexShrink: 0 }}>#{i.toString().padStart(2, '0')}</span>
                  <span>{log}</span>
                </div>
              )) : (
                <div style={{ opacity: 0.2, fontStyle: 'italic', textAlign: 'center', padding: '2.5rem 0', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 900 }}>Ready for Uplink...</div>
              )}
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {/* METRIC CARDS */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
            <style>{`@media (min-width: 768px) { .metrics-grid { grid-template-columns: repeat(4, 1fr) !important; } }`}</style>
            <div className="metrics-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem', gridColumn: 'span 2' }}>
              <MetricCard icon={<Coins />} label="Optimal Entry" value={strategyReport ? estimatedOpeningBid : '--'} sub="Phase 1 Signal" color="emerald" />
              <MetricCard icon={<Clock />} label="Tactical Stage" value={strategyReport ? (rec.score > 60 ? 'Steady' : 'Late Stage') : '--'} sub="Active Window" color="blue" />
              <MetricCard icon={<Target />} label="Victory Prob" value={strategyReport ? `${rec.score}%` : '--'} sub="Alpha Rating" color="white" />
              <MetricCard icon={<ShieldCheck />} label="Kill Switch" value={strategyReport ? `$${personalValue.toLocaleString()}` : '--'} sub="Absolute Limit" color="rose" />
            </div>
          </div>

          {/* CHARTS */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
            <style>{`@media (min-width: 1280px) { .charts-grid { grid-template-columns: repeat(2, 1fr) !important; } }`}</style>
            <div className="charts-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
              {/* CONVERGENCE */}
              <div className="card card-xl group" style={{ height: '450px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 10 }}>
                  <h3 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', fontStyle: 'italic', color: 'var(--color-text-muted)', letterSpacing: '0.15em' }}>Convergence Analysis</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', background: 'var(--color-emerald)', boxShadow: '0 0 10px rgba(16,185,129,0.4)' }} />
                    <span className="text-label">Neural Stream</span>
                  </div>
                </div>
                <div style={{ flex: 1, minHeight: 0, position: 'relative', zIndex: 10 }}>
                  {simData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={simData}>
                        <defs>
                          <linearGradient id="curveGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                        <XAxis dataKey="round" hide />
                        <YAxis stroke="#475569" fontSize={9} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px' }} />
                        <Area type="monotone" dataKey="price" stroke="#10b981" fill="url(#curveGrad)" strokeWidth={3} isAnimationActive={true} />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.1, background: 'rgba(2,6,23,0.4)', borderRadius: 'var(--radius-xl)', border: '1px dashed var(--color-border)' }}>
                      <Activity style={{ width: '3rem', height: '3rem', marginBottom: '1rem' }} className="animate-pulse" />
                      <p className="text-label">Awaiting Simulation</p>
                    </div>
                  )}
                </div>
              </div>

              {/* PROFITABILITY */}
              <div className="card card-xl group" style={{ height: '450px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 10 }}>
                  <h3 style={{ fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', fontStyle: 'italic', color: 'var(--color-text-muted)', letterSpacing: '0.15em' }}>Profitability Frontier</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', background: 'var(--color-blue)', boxShadow: '0 0 10px rgba(59,130,246,0.4)' }} />
                    <span className="text-label">Efficiency Limit</span>
                  </div>
                </div>
                <div style={{ flex: 1, minHeight: 0, position: 'relative', zIndex: 10 }}>
                  {profitData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={profitData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                        <XAxis dataKey="label" stroke="#475569" fontSize={9} axisLine={false} tickLine={false} />
                        <YAxis hide />
                        <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px' }} />
                        <Bar dataKey="margin" fill="#10b981" radius={[8, 8, 0, 0]} opacity={0.6} />
                        <Line type="monotone" dataKey="risk" stroke="#f43f5e" strokeWidth={3} dot={false} />
                      </ComposedChart>
                    </ResponsiveContainer>
                  ) : (
                    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.1, background: 'rgba(2,6,23,0.4)', borderRadius: 'var(--radius-xl)', border: '1px dashed var(--color-border)' }}>
                      <TrendingUp style={{ width: '3rem', height: '3rem', marginBottom: '1rem' }} className="animate-pulse" />
                      <p className="text-label">Offline</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ACTIVE NODES */}
          {strategyReport && (
            <section className="card card-xl animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 900, textTransform: 'uppercase', fontStyle: 'italic', color: 'var(--color-text-secondary)', letterSpacing: '0.15em', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Radar style={{ width: '1rem', height: '1rem', color: 'var(--color-blue)' }} />
                  Active Neural Nodes
                </h4>
                <span className="text-overline">Hover to Inspect Combat Profiles</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                {activeBidders.map((node: Bidder) => (
                  <div key={node.id} className="card-compact group transition-all hover-border-blue" style={{ padding: '1.5rem', background: 'var(--color-bg-input)', cursor: 'help' }}>
                    <div style={{ position: 'absolute', right: '-1rem', top: '-1rem', opacity: 0.05 }}>
                      <Fingerprint style={{ width: '5rem', height: '5rem' }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', position: 'relative', zIndex: 10 }}>
                      <div style={{ width: '2.5rem', height: '2.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
                        <Cpu style={{ width: '1.25rem', height: '1.25rem' }} />
                      </div>
                      <div>
                        <div style={{ fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.05em', fontStyle: 'italic' }}>{node.name}</div>
                        <div className="text-micro" style={{ color: 'var(--color-text-muted)' }}>{node.personality}</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', position: 'relative', zIndex: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="text-micro" style={{ color: 'var(--color-text-faint)' }}>Risk Factor</span>
                        <span className="text-micro" style={{ color: 'var(--color-blue)' }}>{(node.riskAversion * 100).toFixed(0)}%</span>
                      </div>
                      <div className="progress-bar" style={{ height: '0.25rem' }}>
                        <div style={{ height: '100%', background: 'rgba(59,130,246,0.5)', borderRadius: '9999px', width: `${node.riskAversion * 100}%` }} />
                      </div>
                      <p className="text-micro" style={{ color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
                        Target Valuation Threshold: ${node.trueValueBase.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* STRATEGY REPORT & THREATS */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2.5rem' }}>
            <style>{`@media (min-width: 1024px) { .report-grid { grid-template-columns: 7fr 5fr !important; } }`}</style>
            <div className="report-grid" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2.5rem' }}>
              {/* STRATEGY */}
              <section className="card card-xl" style={{ minHeight: '500px' }}>
                <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                    <div style={{ width: '3.5rem', height: '3.5rem', background: 'rgba(16,185,129,0.1)', borderRadius: 'var(--radius-xl)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(16,185,129,0.2)', boxShadow: 'var(--shadow-card)' }}>
                      <BrainCircuit style={{ color: 'var(--color-emerald-light)', width: '2rem', height: '2rem' }} />
                    </div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.025em', fontStyle: 'italic' }}>Strategic Briefing</h2>
                  </div>
                  {strategyReport ? (
                    <div className="animate-slide-up" style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                      {strategyReport}
                    </div>
                  ) : (
                    <div style={{ padding: '6rem 0', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1.5rem', opacity: 0.2 }}>
                      <Cpu style={{ width: '5rem', height: '5rem', margin: '0 auto', color: 'var(--color-text-faint)' }} className="animate-spin-slow" />
                      <p className="text-label">Synchronizing Intelligence Nodes...</p>
                    </div>
                  )}
                </div>
              </section>

              {/* THREATS & SOURCES */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div className="card card-xl" style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 0, right: 0, padding: '2.5rem', opacity: 0.03, pointerEvents: 'none' }}>
                    <ShieldAlert style={{ width: '8rem', height: '8rem' }} />
                  </div>
                  <h4 className="text-label" style={{ color: 'var(--color-rose)', display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                    <Skull style={{ width: '1rem', height: '1rem' }} />
                    Adversarial Threat Matrix
                  </h4>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <RiskItem label="Winner's Curse" risk="Critical" action="Bidding velocity exceeds fair market value. Anchor to simulation delta." />
                    <RiskItem label="Shill Detection" risk="Moderate" action="Active nodes display non-random jump-bidding. Retain passive posture." />
                    <RiskItem label="Node Exhaustion" risk="Low" action="60% of competitors nearing true valuation ceiling. Pivot imminent." />
                  </ul>
                </div>

                <div className="card card-xl" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <h4 className="text-label" style={{ color: 'var(--color-blue)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Globe style={{ width: '1rem', height: '1rem' }} />
                    Grounding Points
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {groundingSources.length > 0 ? groundingSources.slice(0, 4).map((s: any, idx: number) => (
                      <a key={idx} href={s.web?.uri} target="_blank" rel="noopener noreferrer" className="transition-all hover-border-emerald" style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '1rem', background: 'var(--color-bg-input)',
                        borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)',
                        textDecoration: 'none',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
                          <Crosshair style={{ width: '0.75rem', height: '0.75rem', color: 'var(--color-text-faint)', flexShrink: 0 }} />
                          <span className="text-label truncate">{s.web?.title || 'Comp Listing'}</span>
                        </div>
                        <ExternalLink style={{ width: '0.75rem', height: '0.75rem', color: 'var(--color-bg-elevated)', flexShrink: 0 }} />
                      </a>
                    )) : (
                      <div style={{ fontSize: '10px', color: 'var(--color-bg-elevated)', fontStyle: 'italic', textAlign: 'center', padding: '2.5rem 0', textTransform: 'uppercase', fontWeight: 900, letterSpacing: '0.15em', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-xl)' }}>
                        Awaiting Intelligence Fetch
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WarRoom;
