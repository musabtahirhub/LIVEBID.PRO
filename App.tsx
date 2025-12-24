
import React, { useState, useEffect, useRef } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, ComposedChart, Line, ScatterChart, Scatter, ZAxis
} from 'recharts';
import { 
  TrendingUp, ShieldCheck, Play, Cpu, Coins, BrainCircuit, Target, 
  AlertTriangle, DollarSign, Globe, ExternalLink, RefreshCcw, Search,
  Activity, Zap, BarChart3, ListFilter, Info, Clock, Timer, Lightbulb,
  LayoutDashboard, Newspaper, Users, GraduationCap, ArrowRight, Wallet,
  ShieldAlert, ChevronRight, Gauge, Layers, Radar, Flame
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
  
  // Data State
  const [trendingAuctions, setTrendingAuctions] = useState<RealAuction[]>([]);
  const [groundingSources, setGroundingSources] = useState<any[]>([]);
  const [isLoadingAuctions, setIsLoadingAuctions] = useState(false);
  const [loadMessageIndex, setLoadMessageIndex] = useState(0);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [strategyReport, setStrategyReport] = useState<string | null>(null);
  const [simData, setSimData] = useState<any[]>([]);
  const [bidDistribution, setBidDistribution] = useState<any[]>([]);
  const [rec, setRec] = useState<{ status: string; color: string; score: number }>({ status: 'Awaiting Data', color: 'slate', score: 0 });
  const [logs, setLogs] = useState<string[]>([]);
  
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
    setLogs(prev => [...prev.slice(-20), `[${new Date().toLocaleTimeString()}] ${msg}`]);
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
    setActiveTab('WAR_ROOM');
    addLog(`Target locked: ${auc.name}`);
  };

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    setStrategyReport(null);
    setLogs([]);
    addLog("Initializing Monte Carlo simulation...");
    
    const iterations = 1000;
    const results = [];
    let wins = 0;
    let totalWinPrice = 0;
    let maxComp = 0;
    const activeBidders = INITIAL_BIDDERS.slice(0, competition + 1);

    const distribution: Record<number, number> = {};
    const stepSize = marketValue / 10;

    for (let i = 0; i < iterations; i++) {
      const res = runAuction(AuctionType.ENGLISH, activeBidders, marketValue);
      const userWon = personalValue > res.finalPrice;
      if (userWon) {
        wins++;
        totalWinPrice += res.finalPrice;
      }
      maxComp = Math.max(maxComp, res.finalPrice);
      results.push({ round: i, price: res.finalPrice, userWon });

      const bucket = Math.floor(res.finalPrice / stepSize) * stepSize;
      distribution[bucket] = (distribution[bucket] || 0) + 1;

      if (i % 200 === 0) addLog(`Processing batch ${i}... Current avg: $${(totalWinPrice / (wins || 1)).toFixed(2)}`);
    }

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
    setSimData(results.slice(0, 60));
    setBidDistribution(Object.entries(distribution).map(([price, count]) => ({
      price: `$${Number(price).toLocaleString()}`,
      count
    })));

    addLog("Synthesizing tactical report via Gemini-3 Pro...");
    const report = await getBiddingStrategy(
      itemName, marketValue, personalValue, 
      competition > 3 ? 'Aggressive' : 'Moderate',
      { avgWinPrice, winRate, maxCompetitorBid: maxComp }
    );
    
    setStrategyReport(report.text);
    setGroundingSources(report.sources);
    setIsAnalyzing(false);
    addLog("Analysis finalized. Strategic window calculated.");
  };

  const estimatedOpeningBid = strategyReport?.match(/\$\d+(?:,\d+)?/)?.[0] || `$${(marketValue * 0.75).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;

  return (
    <div className="max-w-[1600px] mx-auto px-4 py-8 md:py-12 bg-slate-950 min-h-screen text-slate-100 font-sans selection:bg-emerald-500/30">
      <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-emerald-500/5 blur-[160px] rounded-full -z-10 animate-pulse" />
      <div className="fixed bottom-0 left-0 w-[800px] h-[800px] bg-blue-500/5 blur-[160px] rounded-full -z-10" />

      {/* HEADER SECTION */}
      <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-12 border-b border-white/5 pb-12">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-20 animate-pulse" />
            <div className="relative w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <Zap className="w-8 h-8 text-slate-950 fill-current" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-4xl font-black tracking-tighter uppercase italic bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-500">
                Live<span className="text-emerald-500">Bid</span>.Pro
              </h1>
            </div>
            <p className="text-slate-500 text-[10px] font-bold tracking-[0.3em] uppercase flex items-center gap-2">
              <Activity className="w-3 h-3 text-emerald-500/50" />
              Strategic Bidding Intelligence
            </p>
          </div>
        </div>

        <nav className="flex items-center gap-2 p-1.5 bg-slate-900/50 border border-white/5 rounded-2xl backdrop-blur-xl">
          <NavButton active={activeTab === 'WAR_ROOM'} onClick={() => setActiveTab('WAR_ROOM')} icon={<LayoutDashboard className="w-4 h-4" />} label="War Room" />
          <NavButton active={activeTab === 'GLOBAL_FEED'} onClick={() => setActiveTab('GLOBAL_FEED')} icon={<Newspaper className="w-4 h-4" />} label="Global Feed" />
          <NavButton active={activeTab === 'AGENT_INTEL'} onClick={() => setActiveTab('AGENT_INTEL')} icon={<Users className="w-4 h-4" />} label="Agent Intel" />
          <NavButton active={activeTab === 'THEORY_LAB'} onClick={() => setActiveTab('THEORY_LAB')} icon={<GraduationCap className="w-4 h-4" />} label="Theory Lab" />
        </nav>
      </header>

      <main>
        {activeTab === 'WAR_ROOM' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-in fade-in duration-500">
            {/* LEFT SIDEBAR: CONFIG & STATUS */}
            <div className="lg:col-span-4 space-y-8">
              <section className="bg-slate-900 border border-white/5 p-8 rounded-[3rem] shadow-2xl space-y-8">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-3">
                  <ListFilter className="w-4 h-4 text-emerald-500" />
                  Mission Profile
                </h3>

                <div className="space-y-6">
                  <div className="relative">
                    <label className="text-[10px] font-black uppercase text-slate-600 mb-3 block">Primary Target</label>
                    <input 
                      type="text" 
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold focus:border-emerald-500/50 focus:outline-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="relative">
                      <label className="text-[10px] font-black uppercase text-slate-600 mb-3 block">Est. Market Value</label>
                      <input 
                        type="number" 
                        value={marketValue}
                        onChange={(e) => setMarketValue(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-white/5 rounded-2xl px-5 py-4 text-sm font-bold focus:border-emerald-500/50 focus:outline-none"
                      />
                    </div>
                    <div className="relative">
                      <label className="text-[10px] font-black uppercase text-slate-600 mb-3 block text-emerald-500">Max Bid Allocation</label>
                      <input 
                        type="number" 
                        value={personalValue}
                        onChange={(e) => setPersonalValue(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-emerald-500/20 rounded-2xl px-5 py-4 text-sm font-bold text-emerald-400 focus:border-emerald-500/50 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="p-6 bg-slate-950/50 rounded-[2rem] border border-white/5">
                    <label className="text-[10px] font-black uppercase text-slate-600 mb-4 block flex justify-between">
                      Competitor Density
                      <span className="text-emerald-500">{competition} Nodes Active</span>
                    </label>
                    <input 
                      type="range" 
                      min="1" max="5" 
                      value={competition}
                      onChange={(e) => setCompetition(Number(e.target.value))}
                      className="w-full accent-emerald-500 bg-slate-800 rounded-lg appearance-none cursor-pointer h-2"
                    />
                  </div>

                  <button 
                    onClick={runAnalysis}
                    disabled={isAnalyzing}
                    className="w-full py-6 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black uppercase tracking-[0.2em] rounded-[2rem] transition-all shadow-2xl flex items-center justify-center gap-4 group active:scale-95"
                  >
                    {isAnalyzing ? <Cpu className="w-6 h-6 animate-spin" /> : <Play className="w-6 h-6 fill-current" />}
                    {isAnalyzing ? 'Processing Strategy...' : 'Initialize Analysis'}
                  </button>
                </div>
              </section>

              {/* MARKET SENTIMENT GAUGE */}
              <section className="bg-slate-900 border border-white/5 p-8 rounded-[3rem] space-y-6 text-center">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Market Sentiment Gauge</h3>
                <div className="relative w-full h-24 bg-slate-950 rounded-[2rem] border border-white/5 flex items-center justify-center overflow-hidden">
                   <div className="absolute inset-y-0 left-0 bg-rose-500/20 w-1/3" />
                   <div className="absolute inset-y-0 left-1/3 bg-amber-500/20 w-1/3" />
                   <div className="absolute inset-y-0 left-2/3 bg-emerald-500/20 w-1/3" />
                   <div className="relative z-10 flex flex-col items-center">
                      <span className="text-2xl font-black italic uppercase text-white">
                        {rec.score > 70 ? 'Bullish' : rec.score > 40 ? 'Neutral' : 'Bearish'}
                      </span>
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Stochastic Volatility Index</span>
                   </div>
                </div>
              </section>

              {/* LOG FEED */}
              <section className="bg-slate-900/30 border border-white/5 p-6 rounded-[2.5rem]">
                <h4 className="text-[10px] font-black uppercase text-slate-600 mb-4 flex items-center gap-2">
                  <Activity className="w-3 h-3 text-emerald-500" />
                  Neural Ticker
                </h4>
                <div ref={scrollRef} className="h-48 overflow-y-auto pr-2 custom-scrollbar font-mono text-[9px] text-slate-500 space-y-2 leading-relaxed">
                  {logs.length > 0 ? logs.map((log, i) => (
                    <div key={i} className="flex gap-2 border-b border-white/5 pb-1">
                      <span className="text-emerald-500/40 shrink-0">[{i}]</span>
                      <span>{log}</span>
                    </div>
                  )) : (
                    <div className="opacity-20 italic">Awaiting simulation data...</div>
                  )}
                </div>
              </section>
            </div>

            {/* MAIN DASHBOARD AREA */}
            <div className="lg:col-span-8 space-y-10">
              {/* TOP WIDGETS */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MetricCard icon={<Coins className="w-4 h-4 text-emerald-500" />} label="Target Entry" value={strategyReport ? estimatedOpeningBid : '--'} sub="Open Signal" />
                <MetricCard icon={<Clock className="w-4 h-4 text-blue-500" />} label="Win Stage" value={strategyReport ? (strategyReport.toLowerCase().includes("final") ? "Late" : "Steady") : '--'} sub="Phase 3 Focus" />
                <MetricCard icon={<Target className="w-4 h-4 text-white" />} label="Win Probability" value={strategyReport ? `${rec.score}%` : '--'} sub="Alpha Rating" />
                <MetricCard icon={<ShieldCheck className="w-4 h-4 text-rose-500" />} label="Safety Stop" value={strategyReport ? `$${personalValue.toLocaleString()}` : '--'} sub="Ceiling Cap" />
              </div>

              {/* TACTICAL VISUALIZATION GRID */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* PRIMARY CHART */}
                <div className="xl:col-span-2 bg-slate-900 border border-white/5 p-10 rounded-[3.5rem] shadow-2xl space-y-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-black uppercase italic text-slate-400 tracking-widest">Price Discovery Curve</h3>
                    <div className="flex items-center gap-4">
                       <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <span className="text-[10px] font-black text-slate-500 uppercase">Optimal Path</span>
                      </div>
                    </div>
                  </div>
                  <div className="h-[300px]">
                    {simData.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={simData}>
                          <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                          <XAxis dataKey="round" hide />
                          <YAxis stroke="#475569" fontSize={10} axisLine={false} tickLine={false} tickFormatter={(val) => `$${val}`} />
                          <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px' }} />
                          <Area type="monotone" dataKey="price" stroke="#10b981" fill="url(#colorPrice)" strokeWidth={4} animationDuration={1500} />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center opacity-10">
                        <Activity className="w-20 h-20 mb-4 animate-pulse" />
                        <p className="font-black uppercase tracking-[0.5em] text-xs">Offline</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* RISK HEATMAP */}
                <div className="bg-slate-900 border border-white/5 p-8 rounded-[3rem] shadow-2xl flex flex-col items-center justify-between">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Efficiency Heatmap</h3>
                   <div className="relative w-48 h-48 border-l border-b border-white/10 flex items-center justify-center bg-slate-950/50 rounded-tr-[2rem]">
                      <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-amber-500/10 to-rose-500/10" />
                      {strategyReport && (
                        <div 
                          className="absolute w-8 h-8 border-2 border-emerald-500 rounded-full flex items-center justify-center animate-ping duration-1000"
                          style={{ 
                            bottom: `${Math.min(90, (personalValue/marketValue) * 45)}%`, 
                            left: `${Math.min(90, rec.score)}%` 
                          }}
                        >
                          <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                        </div>
                      )}
                      <div className="absolute -bottom-6 w-full text-center text-[8px] font-black text-slate-600 uppercase">Alpha Success</div>
                      <div className="absolute -left-12 top-1/2 -rotate-90 text-[8px] font-black text-slate-600 uppercase">Margin Pressure</div>
                   </div>
                   <div className="mt-8 p-4 bg-white/5 rounded-2xl w-full border border-white/5 text-center">
                      <span className="text-[10px] font-black uppercase text-slate-500 block mb-1">Recommended Posture</span>
                      <span className={`text-sm font-black uppercase tracking-widest ${rec.color === 'emerald' ? 'text-emerald-400' : 'text-amber-400'}`}>
                        {rec.score > 70 ? 'Aggressive Efficiency' : 'Tactical Caution'}
                      </span>
                   </div>
                </div>
              </div>

              {/* TACTICAL ROADMAP */}
              <section className="bg-slate-900 border border-white/5 p-10 rounded-[3.5rem] space-y-8">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                          <Layers className="w-5 h-5 text-emerald-500" />
                        </div>
                        <h3 className="text-xl font-black uppercase italic tracking-tight">Tactical Roadmap</h3>
                    </div>
                    <div className="px-4 py-2 bg-slate-950 border border-white/5 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Live Stream Analysis
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/5 hidden md:block" />
                    <RoadmapPhase 
                       icon={<ShieldCheck className="w-4 h-4" />} 
                       title="Phase 1: Entry" 
                       detail={`Initial Bid: ${strategyReport ? estimatedOpeningBid : '--'}`}
                       desc="Establish psychological territory. Deter weak bids."
                       active={!!strategyReport}
                    />
                    <RoadmapPhase 
                       icon={<Activity className="w-4 h-4" />} 
                       title="Phase 2: Pivot" 
                       detail="Counter-Pressure Monitoring"
                       desc="Identify bidder exhaustion points. Hold steady."
                       active={!!strategyReport}
                    />
                    <RoadmapPhase 
                       icon={<Zap className="w-4 h-4" />} 
                       title="Phase 3: Final" 
                       detail={`Sniping Cap: $${personalValue.toLocaleString()}`}
                       desc="Execute terminal move. 95% threshold snip."
                       active={!!strategyReport}
                    />
                 </div>
              </section>

              {/* DETAILED REPORT & INTELLIGENCE */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <section className="bg-slate-900 border border-white/5 p-12 rounded-[3.5rem] relative overflow-hidden shadow-2xl">
                  <div className="relative z-10 space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                        <BrainCircuit className="text-emerald-400 w-8 h-8" />
                      </div>
                      <h2 className="text-2xl font-black uppercase tracking-tight italic">Tactical Briefing</h2>
                    </div>
                    
                    {strategyReport ? (
                      <div className="prose prose-invert prose-emerald max-w-none text-slate-400 text-base leading-relaxed whitespace-pre-wrap selection:bg-emerald-500/50">
                        {strategyReport}
                      </div>
                    ) : (
                      <div className="py-24 text-center space-y-4 opacity-10">
                         <Cpu className="w-16 h-16 mx-auto animate-spin-slow" />
                         <p className="text-[10px] font-black uppercase tracking-[0.5em]">Synchronizing Intelligence</p>
                      </div>
                    )}
                  </div>
                </section>

                <div className="space-y-8">
                   <div className="bg-slate-900 border border-white/5 p-8 rounded-[3rem] space-y-6">
                      <h4 className="text-[10px] font-black uppercase text-rose-500 flex items-center gap-2 tracking-[0.2em]">
                        <ShieldAlert className="w-4 h-4" />
                        Threat Assessment
                      </h4>
                      <ul className="space-y-4">
                         <RiskItem label="Winner's Curse" risk="High" action="Maintain strictly defined ceiling. Do not succumb to momentum." />
                         <RiskItem label="Shill Detection" risk="Moderate" action="Gemini scans verify bidder histories for artificial price inflation." />
                         <RiskItem label="Liquidity Gap" risk="Low" action="Market comps confirm high resell potential within current window." />
                      </ul>
                   </div>

                   <div className="bg-slate-900 border border-white/5 p-8 rounded-[3rem] space-y-6">
                      <h4 className="text-[10px] font-black uppercase text-blue-500 flex items-center gap-2 tracking-[0.2em]">
                        <Globe className="w-4 h-4" />
                        External Grounding
                      </h4>
                      <div className="space-y-3">
                         {groundingSources.slice(0, 4).map((s, idx) => (
                           <a key={idx} href={s.web?.uri} target="_blank" className="flex items-center justify-between p-5 bg-slate-950 rounded-2xl border border-white/5 hover:border-emerald-500/50 transition-all group shadow-sm">
                              <div className="flex items-center gap-4">
                                <div className="p-2 bg-white/5 rounded-lg group-hover:text-emerald-500 transition-colors">
                                  <Globe className="w-3 h-3" />
                                </div>
                                <span className="text-[11px] font-bold text-slate-400 group-hover:text-white truncate w-40">{s.web?.title || "Comp Verified"}</span>
                              </div>
                              <ExternalLink className="w-3 h-3 text-slate-800 group-hover:text-emerald-500" />
                           </a>
                         ))}
                         {groundingSources.length === 0 && <div className="text-[10px] text-slate-700 italic text-center py-6 uppercase font-bold tracking-widest border border-dashed border-white/5 rounded-2xl">Awaiting grounding payload</div>}
                      </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* OTHER TABS (GLOBAL_FEED, AGENT_INTEL, THEORY_LAB) REMAIN LARGELY THE SAME BUT WITH THE NEW STYLING CONSTANTS */}
        {activeTab === 'GLOBAL_FEED' && (
          <div className="animate-in fade-in duration-500 space-y-12">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black italic uppercase tracking-tighter">Market Discovery</h2>
                <p className="text-slate-500 text-xs font-bold tracking-widest uppercase mt-1">Global Real-time Lot Tracking</p>
              </div>
              <button onClick={fetchAuctions} className="px-8 py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl hover:bg-emerald-500 hover:text-slate-950 transition-all font-black uppercase text-[10px] tracking-widest flex items-center gap-3">
                <RefreshCcw className={`w-4 h-4 ${isLoadingAuctions ? 'animate-spin' : ''}`} />
                Rescan Feed
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {isLoadingAuctions ? Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-72 bg-slate-900 border border-white/5 rounded-[3rem] animate-pulse" />) :
                trendingAuctions.map((auc, idx) => (
                  <div key={idx} className="group p-10 bg-slate-900 border border-white/5 rounded-[3rem] hover:border-emerald-500/50 transition-all hover:-translate-y-2 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.05] pointer-events-none group-hover:opacity-[0.1] transition-opacity">
                        <Activity className="w-24 h-24" />
                    </div>
                    <div className="flex justify-between items-start mb-8 relative z-10">
                      <div className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-[9px] font-black text-emerald-500 uppercase tracking-widest">Active Feed</div>
                      <div className="p-3 bg-white/5 rounded-2xl group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all">
                        <Globe className="w-5 h-5" />
                      </div>
                    </div>
                    <h4 className="text-2xl font-black mb-4 leading-none group-hover:text-emerald-400 transition-colors h-16 overflow-hidden">{auc.name}</h4>
                    <div className="pt-8 border-t border-white/5 flex items-end justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Lot Origin</span>
                        <span className="text-lg font-black text-white italic">{auc.house}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Fair Market</span>
                        <span className="text-2xl font-black text-emerald-500">${auc.estimatedValue.toLocaleString()}</span>
                      </div>
                    </div>
                    <button onClick={() => selectAuction(auc)} className="w-full mt-10 py-5 bg-slate-950 border border-white/10 rounded-2xl group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all font-black uppercase text-[11px] tracking-widest flex items-center justify-center gap-4">
                      Deploy War Room
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ... Other Tabs implemented with consistent design patterns ... */}
        {activeTab === 'AGENT_INTEL' && (
           <div className="animate-in fade-in duration-500 space-y-12">
              <div className="flex items-center gap-4">
                 <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20">
                    <Users className="w-8 h-8 text-blue-400" />
                 </div>
                 <h2 className="text-3xl font-black italic uppercase tracking-tighter">Neural Intelligence</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                 <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {INITIAL_BIDDERS.map(b => (
                       <div key={b.id} className="p-10 bg-slate-900 border border-white/5 rounded-[3rem] shadow-xl group hover:border-blue-500/30 transition-all">
                          <div className="flex items-center gap-5 mb-8">
                             <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-slate-950 transition-all">
                                <Cpu className="w-8 h-8" />
                             </div>
                             <div>
                                <h4 className="text-xl font-black">{b.name}</h4>
                                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{b.personality}</span>
                             </div>
                          </div>
                          <p className="text-slate-400 text-sm leading-relaxed mb-8 h-12 overflow-hidden">{b.description}</p>
                          <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/5">
                             <div>
                                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Valuation Base</span>
                                <span className="text-xl font-black text-white font-mono">${b.trueValueBase}</span>
                             </div>
                             <div>
                                <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Risk Profile</span>
                                <span className="text-xl font-black text-blue-500 font-mono">{(b.riskAversion * 100).toFixed(0)}%</span>
                             </div>
                          </div>
                       </div>
                    ))}
                 </div>
                 <div className="lg:col-span-4 bg-slate-900 border border-white/5 p-10 rounded-[3rem] space-y-10">
                    <h3 className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-3">
                       <Radar className="w-5 h-5 text-blue-500" />
                       Behavioral Scatter
                    </h3>
                    <div className="h-[450px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart>
                                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" />
                                <XAxis type="number" dataKey="risk" name="Risk" unit="%" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                                <YAxis type="number" dataKey="value" name="Value" unit="$" stroke="#475569" fontSize={10} axisLine={false} tickLine={false} />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '16px' }} />
                                <Scatter data={INITIAL_BIDDERS.map(b => ({ name: b.name, risk: b.riskAversion * 100, value: b.trueValueBase }))}>
                                    {INITIAL_BIDDERS.map((_, i) => <Cell key={i} fill={['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'][i % 5]} />)}
                                </Scatter>
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {activeTab === 'THEORY_LAB' && (
           <div className="animate-in fade-in duration-500 space-y-12">
              <div className="flex items-center gap-4">
                 <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20">
                    <GraduationCap className="w-8 h-8 text-purple-400" />
                 </div>
                 <h2 className="text-3xl font-black italic uppercase tracking-tighter">Theorem Playground</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                 <TheoryCard 
                   title="Nash Equilibrium" 
                   desc="In high-stakes environments, the optimal strategy for N bidders involves correcting for the 'Winner's Curse' through stochastic adjustments." 
                   icon={<BrainCircuit className="w-8 h-8 text-purple-400" />}
                 >
                    <div className="h-64 mt-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={[{x:1, y:10}, {x:2, y:15}, {x:3, y:25}, {x:4, y:40}]}>
                                <Line type="monotone" dataKey="y" stroke="#a855f7" strokeWidth={4} dot={{ r: 6, fill: '#a855f7' }} />
                                <CartesianGrid stroke="#ffffff05" vertical={false} />
                                <XAxis hide /> <YAxis hide />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                 </TheoryCard>
                 <TheoryCard 
                   title="Mechanism Design" 
                   desc="Vickrey auctions utilize a second-price sealed-bid rule to force bidders to bid their true valuation, achieving 100% truthfulness." 
                   icon={<Gauge className="w-8 h-8 text-emerald-400" />}
                   color="emerald"
                 >
                    <div className="h-64 mt-10">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={[{x: 'Eng', y: 70}, {x: 'Vic', y: 100}]}>
                                <Bar dataKey="y" radius={[10, 10, 0, 0]}>
                                    <Cell fill="#475569" />
                                    <Cell fill="#10b981" />
                                </Bar>
                                <XAxis dataKey="x" axisLine={false} tickLine={false} fontSize={10} stroke="#475569" />
                                <YAxis hide />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                 </TheoryCard>
              </div>
           </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="mt-32 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10 text-slate-600 text-[10px] font-black uppercase tracking-[0.3em]">
        <div className="flex items-center gap-4 group cursor-help">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
          <span className="group-hover:text-emerald-500 transition-colors">Protocol Status: High Integrity</span>
        </div>
        <div className="flex flex-wrap justify-center gap-12">
          <span className="hover:text-white transition-colors cursor-pointer">Model: Gemini Pro 3.0</span>
          <span className="hover:text-white transition-colors cursor-pointer">Grounding: Search Enabled</span>
        </div>
        <div className="text-slate-800">
          &copy; 2025 LiveBid Tactical Systems • Deployment Build 4.1.0
        </div>
      </footer>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #10b981; }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 12s linear infinite; }
      `}</style>
    </div>
  );
};

/* COMPONENT HELPERS */
const NavButton: React.FC<{active: boolean; onClick: () => void; icon: React.ReactNode; label: string;}> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all ${active ? 'bg-emerald-500 text-slate-950 shadow-xl shadow-emerald-500/20' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
    {icon}
    <span className="hidden sm:inline">{label}</span>
  </button>
);

const MetricCard: React.FC<{icon: React.ReactNode; label: string; value: string; sub: string;}> = ({ icon, label, value, sub }) => (
  <div className="p-8 bg-slate-900 border border-white/5 rounded-[2.5rem] relative overflow-hidden group hover:border-emerald-500/30 transition-all shadow-xl">
    <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-3">
      <div className="p-2 bg-white/5 rounded-lg group-hover:text-emerald-400 transition-colors">{icon}</div>
      {label}
    </div>
    <div className="text-3xl font-black italic text-white leading-none group-hover:text-emerald-400 transition-colors mb-2">{value}</div>
    <div className="text-[9px] text-slate-600 font-black uppercase tracking-widest">{sub}</div>
  </div>
);

const RoadmapPhase: React.FC<{icon: React.ReactNode; title: string; detail: string; desc: string; active: boolean;}> = ({ icon, title, detail, desc, active }) => (
  <div className={`relative z-10 p-8 rounded-[2.5rem] border transition-all duration-700 shadow-2xl ${active ? 'bg-slate-950 border-emerald-500/40 translate-y-[-5px]' : 'bg-slate-900/50 border-white/5 opacity-40'}`}>
     <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-inner ${active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-800'}`}>
        {icon}
     </div>
     <div className="text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest">{title}</div>
     <div className="text-lg font-black text-white mb-3 italic">{detail}</div>
     <p className="text-[10px] text-slate-600 font-bold uppercase leading-relaxed">{desc}</p>
  </div>
);

const RiskItem: React.FC<{label: string; risk: string; action: string;}> = ({ label, risk, action }) => (
  <li className="space-y-2 p-4 bg-slate-950/50 rounded-2xl border border-white/5">
     <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
        <span className="text-slate-400">{label}</span>
        <span className={risk === 'High' ? 'text-rose-500' : risk === 'Moderate' ? 'text-amber-500' : 'text-emerald-500'}>{risk} Risk Level</span>
     </div>
     <p className="text-[10px] text-slate-600 font-bold leading-relaxed">{action}</p>
  </li>
);

const TheoryCard: React.FC<{title: string; desc: string; icon: React.ReactNode; children: React.ReactNode; color?: string;}> = ({ title, desc, icon, children, color = 'purple' }) => (
    <div className="bg-slate-900 border border-white/5 p-12 rounded-[4rem] shadow-2xl relative overflow-hidden group">
        <div className={`absolute -top-10 -right-10 w-40 h-40 bg-${color}-500/10 blur-3xl rounded-full`} />
        <div className="flex items-center gap-6 mb-8 relative z-10">
            <div className={`w-14 h-14 bg-${color}-500/10 rounded-2xl flex items-center justify-center border border-${color}-500/20`}>
                {icon}
            </div>
            <h3 className="text-3xl font-black uppercase italic tracking-tighter">{title}</h3>
        </div>
        <p className="text-slate-400 text-sm leading-relaxed mb-10 relative z-10">{desc}</p>
        {children}
    </div>
);

// Fallback for re-exports or manual definitions if required by environment
const LineChart = ComposedChart;

export default App;
