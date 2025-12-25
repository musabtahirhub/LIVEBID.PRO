
import React, { useState, useEffect, useRef } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, ComposedChart, Line, ScatterChart, Scatter, ZAxis,
  LineChart, PieChart, Pie
} from 'recharts';
import { 
  TrendingUp, ShieldCheck, Play, Cpu, Coins, BrainCircuit, Target, 
  AlertTriangle, DollarSign, Globe, ExternalLink, RefreshCcw, Search,
  Activity, Zap, BarChart3, ListFilter, Info, Clock, Timer, Lightbulb,
  LayoutDashboard, Newspaper, Users, GraduationCap, ArrowRight, Wallet,
  ShieldAlert, ChevronRight, Gauge, Layers, Radar, Flame, TrendingDown,
  Skull, Sword, Crosshair, ZapOff, Fingerprint, Lock, Unlock
} from 'lucide-react';
import { AuctionType } from './types';
import { INITIAL_BIDDERS } from './constants';
import { runAuction } from './services/auctionEngine';
import { getBiddingStrategy, getTrendingAuctions, RealAuction } from './services/geminiService';

const LOADING_MESSAGES = [
  "Searching global auction houses...",
  "Scanning Sotheby's & Christie's...",
  "Extracting market valuations...",
  "Verifying lot details...",
  "Grounding real-time listings..."
];

type Tab = 'WAR_ROOM' | 'GLOBAL_FEED' | 'AGENT_INTEL' | 'THEORY_LAB';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('WAR_ROOM');
  
  // Simulation State
  const [itemName, setItemName] = useState('Rare 1st Edition Charizard');
  const [marketValue, setMarketValue] = useState(1500);
  const [personalValue, setPersonalValue] = useState(1800);
  const [competition, setCompetition] = useState(3);
  const [userBid, setUserBid] = useState(0);
  
  // Data State
  const [trendingAuctions, setTrendingAuctions] = useState<RealAuction[]>([]);
  const [groundingSources, setGroundingSources] = useState<any[]>([]);
  const [isLoadingAuctions, setIsLoadingAuctions] = useState(false);
  const [loadMessageIndex, setLoadMessageIndex] = useState(0);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [strategyReport, setStrategyReport] = useState<string | null>(null);
  const [simData, setSimData] = useState<any[]>([]);
  const [profitData, setProfitData] = useState<any[]>([]);
  const [sentimentData, setSentimentData] = useState<any[]>([]);
  const [rec, setRec] = useState<{ status: string; color: string; score: number }>({ status: 'Awaiting Data', color: 'slate', score: 0 });
  const [logs, setLogs] = useState<string[]>([]);
  const [threat, setThreat] = useState<any>(null);
  const [marketHeat, setMarketHeat] = useState(20);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let interval: any;
    if (isLoadingAuctions) {
      interval = setInterval(() => {
        setLoadMessageIndex(prev => (prev + 1) % LOADING_MESSAGES.length);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isLoadingAuctions]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-25), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const fetchAuctions = async () => {
    setIsLoadingAuctions(true);
    addLog("Initiating global auction discovery...");
    try {
      const result = await getTrendingAuctions();
      setTrendingAuctions(result.auctions);
      addLog(`Discovery complete. Found ${result.auctions.length} high-profile listings.`);
    } catch (e) {
      addLog("Error accessing live data feeds.");
    } finally {
      setIsLoadingAuctions(false);
    }
  };

  useEffect(() => {
    fetchAuctions();
  }, []);

  const selectAuction = (auc: RealAuction) => {
    setItemName(auc.name);
    setMarketValue(auc.estimatedValue);
    setPersonalValue(Math.floor(auc.estimatedValue * 1.15));
    setUserBid(Math.floor(auc.estimatedValue * 0.8));
    setActiveTab('WAR_ROOM');
    addLog(`Target locked: ${auc.name}`);
  };

  const handleManualBid = (amount: number) => {
    const newBid = userBid + amount;
    setUserBid(newBid);
    setMarketHeat(prev => Math.min(100, prev + 5));
    addLog(`Injected manual bid: $${newBid.toLocaleString()}. Calculating friction...`);
    
    // Quick recalculation of win rate based on manual bid
    const wins = simData.filter(d => newBid > d.price).length;
    const newScore = Math.round((wins / (simData.length || 1)) * 100);
    setRec(prev => ({ ...prev, score: newScore }));
  };

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    setStrategyReport(null);
    setLogs([]);
    addLog("Initializing Monte Carlo simulation...");
    
    const iterations = 250;
    const results = [];
    let wins = 0;
    let totalWinPrice = 0;
    let maxComp = 0;
    const activeBidders = INITIAL_BIDDERS.slice(0, competition + 1);

    // Identify threat
    const sortedThreats = [...activeBidders].sort((a, b) => b.trueValueBase - a.trueValueBase);
    setThreat(sortedThreats[0]);

    // Sentiment Calculation
    const agg = activeBidders.filter(b => b.riskAversion < 0.4).length;
    const cons = activeBidders.length - agg;
    setSentimentData([
      { name: 'Aggressive', value: agg, color: '#f43f5e' },
      { name: 'Conservative', value: cons, color: '#3b82f6' }
    ]);

    for (let i = 0; i < iterations; i++) {
      const res = runAuction(AuctionType.ENGLISH, activeBidders, marketValue);
      const userWon = personalValue > res.finalPrice;
      if (userWon) {
        wins++;
        totalWinPrice += res.finalPrice;
      }
      maxComp = Math.max(maxComp, res.finalPrice);
      results.push({ round: i, price: res.finalPrice, userWon });
    }

    // Profitability Frontier
    const pFrontier = [];
    for (let p = 0.5; p <= 1.5; p += 0.1) {
      const testPrice = marketValue * p;
      const profit = personalValue - testPrice;
      pFrontier.push({
        label: `${(p * 100).toFixed(0)}%`,
        margin: profit > 0 ? profit : 0,
        risk: testPrice > marketValue ? testPrice - marketValue : 0
      });
    }
    setProfitData(pFrontier);

    const winRate = wins / iterations;
    const avgWinPrice = wins > 0 ? totalWinPrice / wins : 0;
    const score = Math.round(winRate * 100);

    let status = 'Caution';
    let color = 'amber';
    if (winRate > 0.7 && avgWinPrice < personalValue * 0.9) {
      status = 'Strong Buy';
      color = 'emerald';
    } else if (winRate < 0.2 || avgWinPrice > personalValue) {
      status = 'Avoid';
      color = 'rose';
    }

    setRec({ status, color, score });
    setSimData(results.slice(0, 100));
    setMarketHeat(Math.floor(Math.random() * 30) + 10);

    addLog("Consulting LLM for strategic overrides...");
    const report = await getBiddingStrategy(
      itemName, marketValue, personalValue, 
      competition > 3 ? 'High' : 'Moderate',
      { avgWinPrice, winRate, maxCompetitorBid: maxComp }
    );
    
    setStrategyReport(report.text);
    setGroundingSources(report.sources);
    setIsAnalyzing(false);
    addLog("Deployment ready. Direct Combat Console unlocked.");
  };

  const estimatedOpeningBid = strategyReport?.match(/\$\d+(?:,\d+)?/)?.[0] || `$${(marketValue * 0.75).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-8 md:py-12 bg-slate-950 min-h-screen text-slate-100 font-sans selection:bg-emerald-500/30">
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-emerald-500/5 blur-[160px] rounded-full -z-10 animate-pulse" />
      <div className="fixed bottom-0 left-0 w-[800px] h-[800px] bg-blue-500/5 blur-[160px] rounded-full -z-10" />

      {/* TOP HEADER */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12 border-b border-white/5 pb-10">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-10 animate-pulse" />
            <div className="relative w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <Zap className="w-7 h-7 text-slate-950 fill-current" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black tracking-tighter uppercase italic">
                Live<span className="text-emerald-500">Bid</span>.Pro
              </h1>
              <div className="hidden sm:block px-2 py-0.5 bg-white/5 border border-white/10 rounded-md text-[8px] font-black text-slate-500 uppercase tracking-widest">COMBAT v4.5</div>
            </div>
            <p className="text-slate-500 text-[9px] font-black tracking-[0.4em] uppercase mt-1">High-Stakes Auction Bidding Terminal</p>
          </div>
        </div>

        <nav className="flex items-center gap-1 p-1 bg-slate-900 border border-white/5 rounded-2xl">
          <NavButton active={activeTab === 'WAR_ROOM'} onClick={() => setActiveTab('WAR_ROOM')} icon={<LayoutDashboard className="w-4 h-4" />} label="War Room" />
          <NavButton active={activeTab === 'GLOBAL_FEED'} onClick={() => setActiveTab('GLOBAL_FEED')} icon={<Newspaper className="w-4 h-4" />} label="Global Feed" />
          <NavButton active={activeTab === 'AGENT_INTEL'} onClick={() => setActiveTab('AGENT_INTEL')} icon={<Users className="w-4 h-4" />} label="Agent Intel" />
          <NavButton active={activeTab === 'THEORY_LAB'} onClick={() => setActiveTab('THEORY_LAB')} icon={<GraduationCap className="w-4 h-4" />} label="Theory Lab" />
        </nav>
      </header>

      <main className="min-h-[700px]">
        {activeTab === 'WAR_ROOM' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* LEFT COLUMN: COMMAND & COMBAT */}
            <div className="lg:col-span-4 space-y-8">
              {/* TARGETING PROFILE */}
              <section className="bg-slate-900 border border-white/5 p-8 rounded-[3rem] shadow-2xl space-y-8">
                <div className="flex items-center justify-between">
                   <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-3">
                    <ListFilter className="w-4 h-4 text-emerald-500" />
                    Targeting Profile
                  </h3>
                  {strategyReport && <Flame className={`w-4 h-4 ${marketHeat > 70 ? 'text-rose-500 animate-bounce' : 'text-amber-500'}`} />}
                </div>

                <div className="space-y-6">
                  <div className="relative group">
                    <label className="text-[10px] font-black uppercase text-slate-600 mb-2 block tracking-widest">Asset Identifier</label>
                    <input 
                      type="text" value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold focus:border-emerald-500/50 focus:outline-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <label className="text-[10px] font-black uppercase text-slate-600 mb-2 block tracking-widest">Fair Market</label>
                      <input 
                        type="number" value={marketValue}
                        onChange={(e) => setMarketValue(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-white/10 rounded-2xl px-5 py-4 text-sm font-bold focus:border-emerald-500/50 focus:outline-none"
                      />
                    </div>
                    <div className="relative">
                      <label className="text-[10px] font-black uppercase text-slate-600 mb-2 block tracking-widest text-emerald-500">Hard Limit</label>
                      <input 
                        type="number" value={personalValue}
                        onChange={(e) => setPersonalValue(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-emerald-500/20 rounded-2xl px-5 py-4 text-sm font-bold text-emerald-400 focus:border-emerald-500/50 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="p-6 bg-slate-950/50 rounded-[2rem] border border-white/5">
                    <label className="text-[10px] font-black uppercase text-slate-600 mb-4 block flex justify-between tracking-widest">
                      Competitor Density
                      <span className="text-emerald-500 font-mono">{competition} NODES</span>
                    </label>
                    <input 
                      type="range" min="1" max="5" value={competition}
                      onChange={(e) => setCompetition(Number(e.target.value))}
                      className="w-full accent-emerald-500 bg-slate-800 rounded-lg appearance-none cursor-pointer h-1.5"
                    />
                  </div>

                  <button 
                    onClick={runAnalysis}
                    disabled={isAnalyzing}
                    className="w-full py-6 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black uppercase tracking-[0.2em] rounded-[2.5rem] transition-all shadow-2xl flex items-center justify-center gap-4 active:scale-95"
                  >
                    {isAnalyzing ? <Cpu className="w-6 h-6 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
                    {isAnalyzing ? 'Synchronizing Nodes...' : 'Execute Analysis'}
                  </button>
                </div>
              </section>

              {/* DIRECT COMBAT CONSOLE (INTERACTIVE) */}
              {strategyReport && (
                <section className="bg-slate-900 border border-white/10 p-8 rounded-[3rem] shadow-2xl space-y-6 animate-in zoom-in-95 duration-500">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-black uppercase text-emerald-500 flex items-center gap-3 tracking-[0.2em]">
                      <Sword className="w-4 h-4" />
                      Combat Console
                    </h4>
                    <div className="px-3 py-1 bg-emerald-500/10 rounded-full text-[8px] font-black text-emerald-500 uppercase">Live Input</div>
                  </div>

                  <div className="bg-slate-950 p-6 rounded-2xl border border-white/5 text-center">
                    <div className="text-[10px] font-black text-slate-600 uppercase mb-2 tracking-widest">Your Current Position</div>
                    <div className="text-4xl font-black italic text-emerald-400 font-mono tracking-tighter">${userBid.toLocaleString()}</div>
                    <div className={`text-[9px] font-black uppercase mt-3 px-2 py-1 rounded-md inline-block ${userBid > personalValue ? 'bg-rose-500/20 text-rose-400' : 'bg-white/5 text-slate-500'}`}>
                      {userBid > personalValue ? 'LIMIT EXCEEDED' : 'WITHIN THRESHOLD'}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => handleManualBid(50)} className="py-4 bg-slate-950 border border-white/10 rounded-xl text-[10px] font-black uppercase hover:bg-white/5 transition-all active:scale-95">+ $50</button>
                    <button onClick={() => handleManualBid(250)} className="py-4 bg-slate-950 border border-white/10 rounded-xl text-[10px] font-black uppercase hover:bg-white/5 transition-all active:scale-95">+ $250</button>
                    <button onClick={() => handleManualBid(500)} className="col-span-2 py-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-[10px] font-black uppercase text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 transition-all active:scale-95 flex items-center justify-center gap-3">
                      <Zap className="w-3 h-3" /> Jump Bid $500
                    </button>
                  </div>
                </section>
              )}

              {/* MARKET HEAT INDEX */}
              <section className="bg-slate-900 border border-white/5 p-8 rounded-[2.5rem] space-y-6">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                   <span>Market Heat Index</span>
                   <span className={marketHeat > 70 ? 'text-rose-500' : 'text-emerald-500'}>{marketHeat}%</span>
                </div>
                <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-white/5">
                   <div className={`h-full transition-all duration-1000 ${marketHeat > 70 ? 'bg-rose-500' : marketHeat > 40 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${marketHeat}%` }} />
                </div>
                <p className="text-[9px] text-slate-600 font-bold uppercase leading-relaxed text-center italic">
                  {marketHeat > 70 ? 'Warning: Aggressive FOMO detected. Retract manual input.' : 'Market remains stable. Opportunity window remains open.'}
                </p>
              </section>

              {/* TACTICAL LOG */}
              <section className="bg-slate-900/30 border border-white/5 p-6 rounded-[2.5rem]">
                <div ref={scrollRef} className="h-40 overflow-y-auto pr-2 custom-scrollbar font-mono text-[9px] text-slate-500 space-y-2">
                  {logs.length > 0 ? logs.map((log, i) => (
                    <div key={i} className="flex gap-3 border-b border-white/5 pb-1 animate-in slide-in-from-left-2">
                      <span className="text-emerald-500/30 shrink-0">#{i.toString().padStart(2, '0')}</span>
                      <span>{log}</span>
                    </div>
                  )) : (
                    <div className="opacity-20 italic text-center py-10 uppercase tracking-widest font-black">Ready for Uplink...</div>
                  )}
                </div>
              </section>
            </div>

            {/* MAIN COLUMN: VISUALS & STRATEGY */}
            <div className="lg:col-span-8 space-y-10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                <MetricCard icon={<Coins />} label="Optimal Entry" value={strategyReport ? estimatedOpeningBid : '--'} sub="Phase 1 Signal" color="emerald" />
                <MetricCard icon={<Clock />} label="Tactical Stage" value={strategyReport ? (rec.score > 60 ? "Steady" : "Late Stage") : '--'} sub="Active Window" color="blue" />
                <MetricCard icon={<Target />} label="Victory Prob" value={strategyReport ? `${rec.score}%` : '--'} sub="Alpha Rating" color="white" />
                <MetricCard icon={<ShieldCheck />} label="Kill Switch" value={strategyReport ? `$${personalValue.toLocaleString()}` : '--'} sub="Absolute Limit" color="rose" />
              </div>

              {/* CORE CHARTS */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* DISCOVERY CURVE */}
                <div className="bg-slate-900 border border-white/5 p-10 rounded-[3.5rem] shadow-2xl space-y-8 h-[450px] relative overflow-hidden group">
                  <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  <div className="flex items-center justify-between relative z-10">
                    <h3 className="text-xs font-black uppercase italic text-slate-500 tracking-widest">Convergence Analysis</h3>
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/40" />
                       <span className="text-[10px] font-black text-slate-600 uppercase">Neural Stream</span>
                    </div>
                  </div>
                  <div className="h-[300px] w-full relative z-10">
                    {simData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={simData}>
                          <defs>
                            <linearGradient id="curveGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
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
                      <div className="h-full flex flex-col items-center justify-center opacity-10 bg-slate-950/40 rounded-[2rem] border border-dashed border-white/10">
                         <Activity className="w-12 h-12 mb-4 animate-pulse" />
                         <p className="text-[10px] font-black uppercase tracking-[0.4em]">Awaiting Simulation</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* MARGIN PROJECTION */}
                <div className="bg-slate-900 border border-white/5 p-10 rounded-[3.5rem] shadow-2xl space-y-8 h-[450px] relative overflow-hidden group">
                  <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  <div className="flex items-center justify-between relative z-10">
                    <h3 className="text-xs font-black uppercase italic text-slate-500 tracking-widest">Profitability Frontier</h3>
                    <div className="flex items-center gap-2">
                       <div className="w-2 h-2 rounded-full bg-blue-500 shadow-lg shadow-blue-500/40" />
                       <span className="text-[10px] font-black text-slate-600 uppercase">Efficiency Limit</span>
                    </div>
                  </div>
                  <div className="h-[300px] w-full relative z-10">
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
                      <div className="h-full flex flex-col items-center justify-center opacity-10 bg-slate-950/40 rounded-[2rem] border border-dashed border-white/10">
                         <TrendingUp className="w-12 h-12 mb-4 animate-pulse" />
                         <p className="text-[10px] font-black uppercase tracking-[0.4em]">Offline</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* INTERACTIVE ADVERSARIES CARD */}
              {strategyReport && (
                <section className="bg-slate-900 border border-white/5 p-10 rounded-[3.5rem] space-y-8 animate-in fade-in duration-1000">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black uppercase italic text-slate-400 tracking-widest flex items-center gap-3">
                      <Radar className="w-4 h-4 text-blue-500" />
                      Active Neural Nodes
                    </h4>
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Hover to Inspect Combat Profiles</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {INITIAL_BIDDERS.slice(0, competition + 1).map(node => (
                      <div key={node.id} className="p-6 bg-slate-950 rounded-[2.5rem] border border-white/5 hover:border-blue-500/40 transition-all group relative overflow-hidden cursor-help">
                        <div className="absolute -right-4 -top-4 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity">
                           <Fingerprint className="w-20 h-20" />
                        </div>
                        <div className="flex items-center gap-4 mb-4 relative z-10">
                           <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-slate-500 group-hover:text-blue-400 transition-colors">
                              <Cpu className="w-5 h-5" />
                           </div>
                           <div>
                              <div className="text-[11px] font-black uppercase text-white tracking-tighter italic">{node.name}</div>
                              <div className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{node.personality}</div>
                           </div>
                        </div>
                        <div className="space-y-3 relative z-10">
                           <div className="flex justify-between items-center text-[8px] font-black uppercase text-slate-700">
                              <span>Risk Factor</span>
                              <span className="text-blue-500">{(node.riskAversion * 100).toFixed(0)}%</span>
                           </div>
                           <div className="h-1 w-full bg-slate-900 rounded-full">
                              <div className="h-full bg-blue-500/50 rounded-full" style={{ width: `${node.riskAversion * 100}%` }} />
                           </div>
                           <p className="text-[8px] text-slate-600 font-bold uppercase leading-tight opacity-0 group-hover:opacity-100 transition-opacity">
                             Target Valuation Threshold: ${node.trueValueBase.toLocaleString()}
                           </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* TACTICAL REPORT & THREATS */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <section className="lg:col-span-7 bg-slate-900 border border-white/5 p-12 rounded-[4rem] relative overflow-hidden shadow-2xl min-h-[500px]">
                  <div className="relative z-10 space-y-8">
                    <div className="flex items-center gap-5">
                       <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 shadow-lg">
                          <BrainCircuit className="text-emerald-400 w-8 h-8" />
                       </div>
                       <h2 className="text-2xl font-black uppercase tracking-tight italic">Strategic Briefing</h2>
                    </div>
                    {strategyReport ? (
                      <div className="prose prose-invert prose-emerald max-w-none text-slate-400 text-sm leading-relaxed whitespace-pre-wrap selection:bg-emerald-500/50 animate-in fade-in slide-in-from-bottom-2 duration-1000">
                        {strategyReport}
                      </div>
                    ) : (
                      <div className="py-24 text-center space-y-6 opacity-20">
                         <Cpu className="w-20 h-20 mx-auto animate-spin-slow text-slate-700" />
                         <p className="text-[10px] font-black uppercase tracking-[0.5em]">Synchronizing Intelligence Nodes...</p>
                      </div>
                    )}
                  </div>
                </section>

                <div className="lg:col-span-5 space-y-8">
                   <div className="bg-slate-900 border border-white/5 p-10 rounded-[3rem] space-y-8 shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
                         <ShieldAlert className="w-32 h-32" />
                      </div>
                      <h4 className="text-[10px] font-black uppercase text-rose-500 flex items-center gap-4 tracking-[0.3em] relative z-10">
                        <Skull className="w-4 h-4" />
                        Adversarial Threat Matrix
                      </h4>
                      <ul className="space-y-4 relative z-10">
                         <RiskItem label="Winner's Curse" risk="Critical" action="Bidding velocity exceeds fair market value. Anchor to simulation delta." />
                         <RiskItem label="Shill Detection" risk="Moderate" action="Active nodes display non-random jump-bidding. Retain passive posture." />
                         <RiskItem label="Node Exhaustion" risk="Low" action="60% of competitors nearing true valuation ceiling. Pivot imminent." />
                      </ul>
                   </div>

                   <div className="bg-slate-900 border border-white/5 p-10 rounded-[3rem] space-y-6 shadow-xl relative overflow-hidden">
                      <h4 className="text-[10px] font-black uppercase text-blue-500 flex items-center gap-4 tracking-[0.3em]">
                        <Globe className="w-4 h-4" />
                        Grounding Points
                      </h4>
                      <div className="space-y-3">
                         {groundingSources.length > 0 ? groundingSources.slice(0, 4).map((s, idx) => (
                           <a key={idx} href={s.web?.uri} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-white/5 hover:border-emerald-500/50 transition-all group shadow-sm">
                              <div className="flex items-center gap-3 truncate">
                                <Crosshair className="w-3 h-3 text-slate-700 group-hover:text-emerald-500" />
                                <span className="text-[10px] font-black text-slate-500 group-hover:text-white uppercase truncate tracking-wider">{s.web?.title || "Comp Listing"}</span>
                              </div>
                              <ExternalLink className="w-3 h-3 text-slate-800 group-hover:text-emerald-500" />
                           </a>
                         )) : (
                           <div className="text-[10px] text-slate-800 italic text-center py-10 uppercase font-black tracking-widest border border-dashed border-white/10 rounded-[2rem]">Awaiting Intelligence Fetch</div>
                         )}
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FEED TAB */}
        {activeTab === 'GLOBAL_FEED' && (
          <div className="animate-in fade-in duration-500 space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h2 className="text-4xl font-black italic uppercase tracking-tighter">Global discovery</h2>
                <p className="text-slate-500 text-[10px] font-black tracking-[0.4em] uppercase mt-2">Live Multi-Exchange Market Indexes</p>
              </div>
              <button onClick={fetchAuctions} className="px-8 py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl hover:bg-emerald-500 hover:text-slate-950 transition-all font-black uppercase text-[10px] tracking-[0.2em] flex items-center gap-3 active:scale-95">
                <RefreshCcw className={`w-4 h-4 ${isLoadingAuctions ? 'animate-spin' : ''}`} />
                Scan Networks
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
              {isLoadingAuctions ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-80 bg-slate-900 border border-white/5 rounded-[3.5rem] animate-pulse" />) :
                trendingAuctions.map((auc, idx) => (
                  <div key={idx} className="group p-10 bg-slate-900 border border-white/5 rounded-[3.5rem] hover:border-emerald-500/50 transition-all hover:-translate-y-2 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none group-hover:opacity-[0.06] transition-opacity">
                        <Globe className="w-32 h-32" />
                    </div>
                    <div className="flex justify-between items-start mb-8 relative z-10">
                      <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-[8px] font-black text-emerald-500 uppercase tracking-widest">Active Lot</div>
                      <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all shadow-inner">
                        <ExternalLink className="w-4 h-4" />
                      </div>
                    </div>
                    <h4 className="text-2xl font-black mb-4 leading-tight group-hover:text-emerald-400 transition-colors h-16 overflow-hidden uppercase italic tracking-tighter">{auc.name}</h4>
                    <div className="pt-8 border-t border-white/5 flex items-end justify-between">
                      <div>
                        <span className="text-[9px] font-black text-slate-600 uppercase block mb-1 tracking-widest">Origin House</span>
                        <span className="text-base font-black text-white italic truncate block w-32 uppercase">{auc.house}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[9px] font-black text-slate-600 uppercase block mb-1 tracking-widest">Est. Valuation</span>
                        <span className="text-2xl font-black text-emerald-500 font-mono">${auc.estimatedValue.toLocaleString()}</span>
                      </div>
                    </div>
                    <button onClick={() => selectAuction(auc)} className="w-full mt-10 py-5 bg-slate-950 border border-white/10 rounded-2xl group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all font-black uppercase text-[10px] tracking-[0.3em] flex items-center justify-center gap-4 active:scale-95 shadow-xl">
                      Engage War Room
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* AGENT INTEL TAB */}
        {activeTab === 'AGENT_INTEL' && (
           <div className="animate-in fade-in duration-500 space-y-12">
              <div className="flex items-center gap-5">
                 <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 shadow-lg">
                    <Users className="w-7 h-7 text-blue-400" />
                 </div>
                 <h2 className="text-4xl font-black italic uppercase tracking-tighter">Neural intelligence</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-20">
                 <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {INITIAL_BIDDERS.map(b => (
                       <div key={b.id} className="p-10 bg-slate-900 border border-white/5 rounded-[3.5rem] shadow-2xl group hover:border-blue-500/30 transition-all relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none group-hover:opacity-[0.04]">
                             <BrainCircuit className="w-32 h-32" />
                          </div>
                          <div className="flex items-center gap-5 mb-8 relative z-10">
                             <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-slate-950 transition-all shadow-inner">
                                <Cpu className="w-7 h-7" />
                             </div>
                             <div>
                                <h4 className="text-xl font-black italic uppercase tracking-tighter">{b.name}</h4>
                                <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">{b.personality}</span>
                             </div>
                          </div>
                          <p className="text-slate-500 text-xs font-bold leading-relaxed mb-8 h-12 overflow-hidden relative z-10">{b.description}</p>
                          <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/5 relative z-10">
                             <div>
                                <span className="text-[9px] font-black text-slate-600 uppercase block mb-1 tracking-widest">Base Value</span>
                                <span className="text-xl font-black text-white font-mono tracking-tighter italic">${b.trueValueBase}</span>
                             </div>
                             <div>
                                <span className="text-[9px] font-black text-slate-600 uppercase block mb-1 tracking-widest">Risk Tolerance</span>
                                <span className="text-xl font-black text-blue-500 font-mono tracking-tighter italic">{(b.riskAversion * 100).toFixed(0)}%</span>
                             </div>
                          </div>
                       </div>
                    ))}
                 </div>
                 <div className="lg:col-span-4 bg-slate-900 border border-white/5 p-10 rounded-[3.5rem] space-y-10 shadow-2xl">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-4 text-slate-500">
                       <Radar className="w-5 h-5 text-blue-500" />
                       Behavioral Scatter
                    </h3>
                    <div className="h-[480px] w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" />
                                <XAxis type="number" dataKey="risk" name="Risk" unit="%" stroke="#475569" fontSize={9} axisLine={false} tickLine={false} />
                                <YAxis type="number" dataKey="value" name="Value" unit="$" stroke="#475569" fontSize={9} axisLine={false} tickLine={false} />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px' }} />
                                <Scatter data={INITIAL_BIDDERS.map(b => ({ name: b.name, risk: b.riskAversion * 100, value: b.trueValueBase }))}>
                                    {INITIAL_BIDDERS.map((_, i) => <Cell key={i} fill={['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'][i % 5]} />)}
                                </Scatter>
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="p-6 bg-slate-950/50 rounded-2xl border border-white/5 text-center">
                       <p className="text-[9px] font-black text-slate-600 uppercase leading-relaxed tracking-widest">Cross-correlated behavioral analysis across the active neural node field.</p>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* THEORY LAB TAB */}
        {activeTab === 'THEORY_LAB' && (
           <div className="animate-in fade-in duration-500 space-y-12 pb-20">
              <div className="flex items-center gap-5">
                 <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20 shadow-lg">
                    <GraduationCap className="w-8 h-8 text-purple-400" />
                 </div>
                 <h2 className="text-4xl font-black italic uppercase tracking-tighter">Theorem Playground</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                 <TheoryCard title="Nash Equilibrium" desc="The strategy profile where no agent can benefit by changing their strategy. Our engine adjusts for Winner's Curse through stochastic offsets." icon={<BrainCircuit className="w-8 h-8 text-purple-400" />}>
                    <div className="h-64 mt-10 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={[{x:1, y:10}, {x:2, y:15}, {x:3, y:25}, {x:4, y:40}, {x:5, y:60}]}>
                                <Line type="monotone" dataKey="y" stroke="#a855f7" strokeWidth={5} dot={{ r: 6, fill: '#a855f7', stroke: '#0f172a', strokeWidth: 2 }} />
                                <CartesianGrid stroke="#ffffff05" vertical={false} />
                                <XAxis hide /> <YAxis hide />
                                <Tooltip contentStyle={{ display: 'none' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                 </TheoryCard>
                 <TheoryCard title="Vickrey Logic" desc="A second-price auction mechanism designed for truthful information revelation. Bidders are incentivized to bid their 'true valuation' 100% of the time." icon={<Gauge className="w-8 h-8 text-emerald-400" />} color="emerald">
                    <div className="h-64 mt-10 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[{x: 'English', y: 72}, {x: 'Vickrey', y: 100}]}>
                                <Bar dataKey="y" radius={[10, 10, 0, 0]}>
                                    <Cell fill="#334155" />
                                    <Cell fill="#10b981" />
                                </Bar>
                                <XAxis dataKey="x" axisLine={false} tickLine={false} fontSize={10} stroke="#475569" fontWeight="black" />
                                <YAxis hide />
                                <Tooltip contentStyle={{ display: 'none' }} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                 </TheoryCard>
              </div>
           </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="mt-32 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10 text-slate-700 text-[10px] font-black uppercase tracking-[0.4em]">
        <div className="flex items-center gap-4 group cursor-help">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          <span className="group-hover:text-emerald-500 transition-colors">Tactical Integrity: Optimal</span>
        </div>
        <div className="flex flex-wrap justify-center gap-12">
          <span className="hover:text-slate-400 transition-colors cursor-pointer">Grounding Engine v4.5</span>
          <span className="hover:text-slate-400 transition-colors cursor-pointer">Simulation: Multi-Agent</span>
        </div>
        <div className="text-slate-800">
          &copy; 2025 LiveBid Tactical Systems • DEPLOYED STABLE
        </div>
      </footer>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #10b981; }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 12s linear infinite; }
        .recharts-responsive-container { min-height: 0; position: relative; }
      `}</style>
    </div>
  );
};

/* COMPONENT HELPERS */
const NavButton: React.FC<{active: boolean; onClick: () => void; icon: React.ReactNode; label: string;}> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-3 transition-all ${active ? 'bg-emerald-500 text-slate-950 shadow-2xl shadow-emerald-500/30 scale-105' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
    {icon}
    <span className="hidden sm:inline">{label}</span>
  </button>
);

const MetricCard: React.FC<{icon: React.ReactNode; label: string; value: string; sub: string; color: string;}> = ({ icon, label, value, sub, color }) => (
  <div className="p-8 bg-slate-900 border border-white/5 rounded-[2.5rem] relative overflow-hidden group hover:border-white/10 transition-all shadow-xl">
    <div className={`absolute top-0 left-0 w-full h-1 bg-${color}-500 opacity-20`} />
    <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-3">
      <div className={`p-2 bg-white/5 rounded-lg group-hover:text-${color}-400 transition-colors`}>{icon}</div>
      {label}
    </div>
    <div className="text-3xl font-black italic text-white leading-none group-hover:text-emerald-400 transition-colors mb-2 truncate">{value}</div>
    <div className="text-[8px] text-slate-700 font-black uppercase tracking-widest">{sub}</div>
  </div>
);

const RiskItem: React.FC<{label: string; risk: string; action: string;}> = ({ label, risk, action }) => (
  <li className="space-y-2 p-5 bg-slate-950/50 rounded-2xl border border-white/5 group hover:border-white/10 transition-all">
     <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
        <span className="text-slate-400 group-hover:text-white transition-colors">{label}</span>
        <span className={risk === 'Critical' ? 'text-rose-500' : risk === 'Moderate' ? 'text-amber-500' : 'text-emerald-500'}>{risk} Risk</span>
     </div>
     <p className="text-[10px] text-slate-700 font-bold leading-relaxed uppercase">{action}</p>
  </li>
);

const TheoryCard: React.FC<{title: string; desc: string; icon: React.ReactNode; children: React.ReactNode; color?: string;}> = ({ title, desc, icon, children, color = 'purple' }) => (
    <div className="bg-slate-900 border border-white/5 p-12 rounded-[4rem] shadow-2xl relative overflow-hidden group hover:border-white/10 transition-all">
        <div className={`absolute -top-10 -right-10 w-48 h-48 bg-${color}-500/10 blur-[80px] rounded-full group-hover:bg-${color}-500/20 transition-all`} />
        <div className="flex items-center gap-6 mb-8 relative z-10">
            <div className={`w-16 h-16 bg-${color}-500/10 rounded-2xl flex items-center justify-center border border-${color}-500/20 shadow-lg`}>
                {icon}
            </div>
            <h3 className="text-3xl font-black uppercase italic tracking-tighter italic">{title}</h3>
        </div>
        <p className="text-slate-400 text-sm font-bold leading-relaxed mb-10 relative z-10 uppercase tracking-widest">{desc}</p>
        <div className="relative z-10 w-full">
          {children}
        </div>
    </div>
);

export default App;
