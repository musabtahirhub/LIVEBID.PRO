import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import { api } from '../services/api';
import type { RealAuction, SimulationResponse, StrategyResponse, Bidder, Tab } from '../types';

interface AuctionContextType {
  // Navigation
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;

  // Simulation inputs
  itemName: string;
  setItemName: (name: string) => void;
  marketValue: number;
  setMarketValue: (value: number) => void;
  personalValue: number;
  setPersonalValue: (value: number) => void;
  competition: number;
  setCompetition: (count: number) => void;
  userBid: number;
  setUserBid: (bid: number) => void;

  // Data
  trendingAuctions: RealAuction[];
  isLoadingAuctions: boolean;
  loadMessageIndex: number;
  isAnalyzing: boolean;
  strategyReport: string | null;
  groundingSources: any[];
  simData: any[];
  profitData: any[];
  sentimentData: any[];
  activeBidders: Bidder[];
  rec: { status: string; color: string; score: number };
  logs: string[];
  threat: Bidder | null;
  marketHeat: number;

  // Actions
  fetchAuctions: () => Promise<void>;
  selectAuction: (auction: RealAuction) => void;
  runAnalysis: () => Promise<void>;
  handleManualBid: (amount: number) => void;
  scrollRef: React.RefObject<HTMLDivElement>;
}

const AuctionContext = createContext<AuctionContextType | undefined>(undefined);

const LOADING_MESSAGES = [
  "Searching global auction houses...",
  "Scanning Sotheby's & Christie's...",
  "Extracting market valuations...",
  "Verifying lot details...",
  "Grounding real-time listings...",
];

export const AuctionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<Tab>('WAR_ROOM');

  // Simulation inputs
  const [itemName, setItemName] = useState('Rare 1st Edition Charizard');
  const [marketValue, setMarketValue] = useState(1500);
  const [personalValue, setPersonalValue] = useState(1800);
  const [competition, setCompetition] = useState(3);
  const [userBid, setUserBid] = useState(0);

  // Data state
  const [trendingAuctions, setTrendingAuctions] = useState<RealAuction[]>([]);
  const [groundingSources, setGroundingSources] = useState<any[]>([]);
  const [isLoadingAuctions, setIsLoadingAuctions] = useState(false);
  const [loadMessageIndex, setLoadMessageIndex] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [strategyReport, setStrategyReport] = useState<string | null>(null);
  const [simData, setSimData] = useState<any[]>([]);
  const [profitData, setProfitData] = useState<any[]>([]);
  const [sentimentData, setSentimentData] = useState<any[]>([]);
  const [activeBidders, setActiveBidders] = useState<Bidder[]>([]);
  const [rec, setRec] = useState<{ status: string; color: string; score: number }>({ status: 'Awaiting Data', color: 'slate', score: 0 });
  const [logs, setLogs] = useState<string[]>([]);
  const [threat, setThreat] = useState<Bidder | null>(null);
  const [marketHeat, setMarketHeat] = useState(20);

  const scrollRef = useRef<HTMLDivElement>(null!);

  // Loading message rotation
  useEffect(() => {
    let interval: any;
    if (isLoadingAuctions) {
      interval = setInterval(() => {
        setLoadMessageIndex(prev => (prev + 1) % LOADING_MESSAGES.length);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isLoadingAuctions]);

  // Auto-scroll logs
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = useCallback((msg: string) => {
    setLogs(prev => [...prev.slice(-25), `[${new Date().toLocaleTimeString()}] ${msg}`]);
  }, []);

  const fetchAuctions = useCallback(async () => {
    setIsLoadingAuctions(true);
    addLog('Initiating global auction discovery...');
    try {
      const result = await api.ai.getFeed();
      setTrendingAuctions(result.auctions);
      addLog(`Discovery complete. Found ${result.auctions.length} high-profile listings.`);
    } catch {
      addLog('Error accessing live data feeds.');
    } finally {
      setIsLoadingAuctions(false);
    }
  }, [addLog]);

  const selectAuction = useCallback((auc: RealAuction) => {
    setItemName(auc.name);
    setMarketValue(auc.estimatedValue);
    setPersonalValue(Math.floor(auc.estimatedValue * 1.15));
    setUserBid(Math.floor(auc.estimatedValue * 0.8));
    setActiveTab('WAR_ROOM');
    addLog(`Target locked: ${auc.name}`);
  }, [addLog]);

  const handleManualBid = useCallback((amount: number) => {
    setUserBid(prev => {
      const newBid = prev + amount;
      setMarketHeat(h => Math.min(100, h + 5));
      addLog(`Injected manual bid: $${newBid.toLocaleString()}. Calculating friction...`);
      const wins = simData.filter(d => newBid > d.price).length;
      const newScore = Math.round((wins / (simData.length || 1)) * 100);
      setRec(r => ({ ...r, score: newScore }));
      return newBid;
    });
  }, [addLog, simData]);

  const runAnalysis = useCallback(async () => {
    setIsAnalyzing(true);
    setStrategyReport(null);
    setLogs([]);
    addLog('Initializing Monte Carlo simulation...');

    try {
      // Run simulation on backend
      const simResult = await api.simulation.run({
        itemName,
        marketValue,
        personalValue,
        competition,
        iterations: 250,
      });

      setSimData(simResult.simData);
      setProfitData(simResult.profitData);
      setSentimentData(simResult.sentimentData);
      setRec(simResult.recommendation);
      setActiveBidders(simResult.bidders);
      setMarketHeat(Math.floor(Math.random() * 30) + 10);

      // Identify threat
      const sorted = [...simResult.bidders].sort((a, b) => b.trueValueBase - a.trueValueBase);
      setThreat(sorted[0] || null);

      addLog('Consulting LLM for strategic overrides...');

      // Get AI strategy
      const report = await api.ai.getStrategy(
        itemName,
        marketValue,
        personalValue,
        competition > 3 ? 'High' : 'Moderate',
        {
          avgWinPrice: simResult.avgWinPrice,
          winRate: simResult.winRate,
          maxCompetitorBid: simResult.maxCompetitorBid,
        }
      );

      setStrategyReport(report.text);
      setGroundingSources(report.sources);
      addLog('Deployment ready. Direct Combat Console unlocked.');
    } catch (err) {
      addLog('Simulation error. Check backend connectivity.');
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  }, [itemName, marketValue, personalValue, competition, addLog]);

  // Fetch auctions on mount
  useEffect(() => {
    fetchAuctions();
  }, [fetchAuctions]);

  return (
    <AuctionContext.Provider
      value={{
        activeTab, setActiveTab,
        itemName, setItemName,
        marketValue, setMarketValue,
        personalValue, setPersonalValue,
        competition, setCompetition,
        userBid, setUserBid,
        trendingAuctions, isLoadingAuctions, loadMessageIndex,
        isAnalyzing, strategyReport, groundingSources,
        simData, profitData, sentimentData, activeBidders,
        rec, logs, threat, marketHeat,
        fetchAuctions, selectAuction, runAnalysis, handleManualBid,
        scrollRef,
      }}
    >
      {children}
    </AuctionContext.Provider>
  );
};

export function useAuction(): AuctionContextType {
  const context = useContext(AuctionContext);
  if (!context) {
    throw new Error('useAuction must be used within an AuctionProvider');
  }
  return context;
}
