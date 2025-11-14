"use client";

import { useEffect, useState } from "react";
import { TrendingUp, PieChart, Shield, Sparkles, ArrowRight, Zap, Activity } from "lucide-react";

interface Price {
  date: string;
  price: number;
}

interface Weight {
  symbol: string;
  weight: number;
}

interface Risk {
  symbol: string;
  volatility: number;
}

interface Optimization {
  symbol: string;
  weight: number;
}

export default function PortfolioDashboard() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [activeTab, setActiveTab] = useState("performance");
  const [prices, setPrices] = useState<Price[]>([]);
  const [weights, setWeights] = useState<Weight[]>([]);
  const [risk, setRisk] = useState<Risk[]>([]);
  const [optimization, setOptimization] = useState<Optimization[]>([]);
  const [loading, setLoading] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    if (!showWelcome) {
      setLoading(true);
      setTimeout(() => {
        setPrices([
          { date: "Jan", price: 10000 },
          { date: "Feb", price: 10500 },
          { date: "Mar", price: 11200 },
          { date: "Apr", price: 10800 },
          { date: "May", price: 12000 }
        ]);
        setWeights([
          { symbol: "AAPL", weight: 25 },
          { symbol: "GOOGL", weight: 20 },
          { symbol: "MSFT", weight: 30 },
          { symbol: "AMZN", weight: 15 },
          { symbol: "TSLA", weight: 10 }
        ]);
        setRisk([
          { symbol: "AAPL", volatility: 15 },
          { symbol: "GOOGL", volatility: 18 },
          { symbol: "MSFT", volatility: 12 },
          { symbol: "AMZN", volatility: 22 },
          { symbol: "TSLA", volatility: 35 }
        ]);
        setOptimization([
          { symbol: "AAPL", weight: 28 },
          { symbol: "GOOGL", weight: 22 },
          { symbol: "MSFT", weight: 32 },
          { symbol: "AMZN", weight: 12 },
          { symbol: "TSLA", weight: 6 }
        ]);
        setLoading(false);
      }, 1000);
    }
  }, [showWelcome]);

  const LineChart = ({ data }: { data: Price[] }) => {
    if (!data || data.length === 0) {
      return <div className="flex items-center justify-center h-full text-gray-500">Keine Daten verfügbar</div>;
    }
    
    const max = Math.max(...data.map(d => d.price));
    const min = Math.min(...data.map(d => d.price));
    const range = max - min || 1;

    return (
      <div className="w-full h-full flex flex-col p-6">
        <div className="flex-1 relative pb-8">
          <svg className="w-full h-full" viewBox="0 0 800 300" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgba(96,165,250,0.3)" />
                <stop offset="100%" stopColor="rgba(96,165,250,0)" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            
            {/* Grid lines */}
            {[0, 1, 2, 3].map(i => (
              <line
                key={i}
                x1="40"
                y1={i * 75}
                x2="760"
                y2={i * 75}
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="1"
              />
            ))}

            {/* Area under line */}
            <path
              d={`M 40 ${300 - ((data[0].price - min) / range) * 260} ${data
                .map((d, i) => `L ${40 + (i / (data.length - 1)) * 720} ${300 - ((d.price - min) / range) * 260}`)
                .join(" ")} L 760 300 L 40 300 Z`}
              fill="url(#lineGradient)"
            />

            {/* Line with glow */}
            <path
              d={`M 40 ${300 - ((data[0].price - min) / range) * 260} ${data
                .map((d, i) => `L ${40 + (i / (data.length - 1)) * 720} ${300 - ((d.price - min) / range) * 260}`)
                .join(" ")}`}
              fill="none"
              stroke="#60a5fa"
              strokeWidth="3"
              filter="url(#glow)"
            />

            {/* Points */}
            {data.map((d, i) => (
              <g key={i}>
                <circle
                  cx={40 + (i / (data.length - 1)) * 720}
                  cy={300 - ((d.price - min) / range) * 260}
                  r="6"
                  fill="#1e293b"
                  stroke="#60a5fa"
                  strokeWidth="2"
                  className="hover:r-8 transition-all cursor-pointer"
                />
              </g>
            ))}

            {/* X-axis labels */}
            {data.map((d, i) => (
              <text
                key={i}
                x={40 + (i / (data.length - 1)) * 720}
                y="290"
                textAnchor="middle"
                fill="#64748b"
                fontSize="11"
                fontWeight="500"
              >
                {d.date}
              </text>
            ))}
          </svg>
        </div>
      </div>
    );
  };

  const BarChart = ({ data, colors }: { data: { symbol: string; value: number }[]; colors: string[] }) => {
    if (!data || data.length === 0) {
      return <div className="flex items-center justify-center h-full text-gray-500">Keine Daten verfügbar</div>;
    }
    
    const max = Math.max(...data.map(d => d.value)) || 1;

    return (
      <div className="w-full h-full flex flex-col p-6">
        <div className="flex-1 flex items-end justify-around gap-6 pb-8">
          {data.map((d, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-3 max-w-24">
              <div className="text-xs font-semibold text-blue-400">{d.value}%</div>
              <div
                className="w-full rounded-t-2xl transition-all duration-500 hover:scale-105 cursor-pointer relative group shadow-lg"
                style={{
                  height: `${(d.value / max) * 85}%`,
                  background: `linear-gradient(180deg, ${colors[i % colors.length]}, ${colors[i % colors.length]}99)`,
                  minHeight: "30px",
                  boxShadow: `0 0 20px ${colors[i % colors.length]}40`
                }}
              >
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-slate-800/95 backdrop-blur-xl px-3 py-2 rounded-xl text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-2xl border border-white/10">
                  <div className="font-semibold text-white">{d.symbol}</div>
                  <div className="text-blue-400">{d.value}%</div>
                </div>
              </div>
              <div className="text-xs text-slate-400 font-semibold">{d.symbol}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (showWelcome) {
    return (
      <div className="min-h-screen bg-slate-950 relative overflow-hidden">
        {/* Animated background gradient */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(59, 130, 246, 0.15), transparent 40%)`
          }}
        />
        
        {/* Grid pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.02) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />

        <div className="relative min-h-screen flex items-center justify-center p-8">
          <div className="max-w-5xl w-full">
            <div className="text-center space-y-12">
              <div className="inline-block relative">
                <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" />
                <div className="relative w-24 h-24 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-2xl rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-2xl border border-white/10">
                  <TrendingUp className="w-12 h-12 text-blue-400" strokeWidth={2} />
                </div>
              </div>
              
              <div>
                <h1 className="text-8xl font-extralight tracking-tight text-white mb-4">
                  Portfolio<span className="text-blue-400">.</span>
                </h1>
                <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                  <Activity className="w-4 h-4" />
                  <span className="font-light">Analytics Platform</span>
                </div>
              </div>
              
              <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
                Echtzeit-Datenvisualisierung mit modernster Technologie für präzise Investitionsentscheidungen
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-16 mb-12 max-w-4xl mx-auto">
                <div className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 hover:border-blue-500/50 transition-all shadow-2xl hover:shadow-blue-500/10">
                  <div className="bg-blue-500/10 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-all">
                    <TrendingUp className="w-6 h-6 text-blue-400" strokeWidth={2} />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">Performance</h3>
                  <p className="text-sm text-slate-400 font-light">Live Portfolio-Tracking mit Echtzeit-Updates</p>
                </div>
                
                <div className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 hover:border-blue-500/50 transition-all shadow-2xl hover:shadow-blue-500/10">
                  <div className="bg-blue-500/10 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-all">
                    <Zap className="w-6 h-6 text-blue-400" strokeWidth={2} />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">AI-Powered</h3>
                  <p className="text-sm text-slate-400 font-light">Intelligente Optimierungsvorschläge</p>
                </div>
                
                <div className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 hover:border-blue-500/50 transition-all shadow-2xl hover:shadow-blue-500/10">
                  <div className="bg-blue-500/10 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-all">
                    <Shield className="w-6 h-6 text-blue-400" strokeWidth={2} />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">Risk Control</h3>
                  <p className="text-sm text-slate-400 font-light">Volatilitätsanalyse in Echtzeit</p>
                </div>
              </div>

              <button
                onClick={() => setShowWelcome(false)}
                className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 rounded-2xl text-white font-medium text-base shadow-2xl shadow-blue-500/50 hover:shadow-blue-500/70 hover:scale-105 transition-all duration-300"
              >
                Dashboard starten
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 relative">
      {/* Animated background */}
      <div 
        className="fixed inset-0 opacity-20 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(59, 130, 246, 0.15), transparent 40%)`
        }}
      />
      
      {/* Grid pattern */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.02) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }} />

      <div className="relative max-w-7xl mx-auto px-8 py-10">
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-2xl rounded-2xl flex items-center justify-center border border-white/10 shadow-xl">
              <TrendingUp className="w-7 h-7 text-blue-400" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-5xl font-extralight tracking-tight text-white">
                Dashboard
              </h1>
              <p className="text-slate-400 mt-2 font-light text-sm flex items-center gap-2">
                <Activity className="w-3 h-3" />
                Live Analytics • {new Date().toLocaleDateString('de-DE')}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          {[
            { id: "performance", label: "Performance", icon: TrendingUp },
            { id: "allocation", label: "Allocation", icon: PieChart },
            { id: "risk", label: "Risk", icon: Shield },
            { id: "optimization", label: "Optimize", icon: Sparkles }
          ].map(tab => (
            <button
              key={tab.id}
              className={`group flex items-center gap-2.5 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-xl shadow-blue-600/50"
                  : "bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-2xl border border-white/10 text-slate-300 hover:border-blue-500/50 hover:text-white"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon className="w-4 h-4" strokeWidth={2.5} />
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-96 gap-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-2 border-blue-500 border-t-transparent"></div>
              <div className="absolute inset-0 blur-xl bg-blue-500/30 rounded-full"></div>
            </div>
            <p className="text-slate-400 text-sm font-light">Lade Daten...</p>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
            <div className="h-96">
              {activeTab === "performance" && <LineChart data={prices} />}
              {activeTab === "allocation" && (
                <BarChart
                  data={weights.map(w => ({ symbol: w.symbol, value: w.weight }))}
                  colors={["#60a5fa", "#818cf8", "#a78bfa", "#c084fc", "#e879f9"]}
                />
              )}
              {activeTab === "risk" && (
                <BarChart
                  data={risk.map(r => ({ symbol: r.symbol, value: r.volatility }))}
                  colors={["#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16"]}
                />
              )}
              {activeTab === "optimization" && (
                <BarChart
                  data={optimization.map(o => ({ symbol: o.symbol, value: o.weight }))}
                  colors={["#10b981", "#14b8a6", "#06b6d4", "#0ea5e9", "#3b82f6"]}
                />
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-2xl rounded-2xl p-6 border border-white/10 shadow-xl hover:border-blue-500/30 transition-all group">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Total Value</div>
              <TrendingUp className="w-4 h-4 text-blue-400 opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-4xl font-extralight text-white">
              €{prices.length > 0 ? prices[prices.length - 1].price.toLocaleString() : "0"}
            </div>
            <div className="text-xs text-green-400 mt-2 flex items-center gap-1">
              <span>+8.2%</span>
              <span className="text-slate-500">vs. letzte Woche</span>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-2xl rounded-2xl p-6 border border-white/10 shadow-xl hover:border-blue-500/30 transition-all group">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Assets</div>
              <PieChart className="w-4 h-4 text-blue-400 opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-4xl font-extralight text-white">{weights.length}</div>
            <div className="text-xs text-slate-500 mt-2">Diversifiziert</div>
          </div>
          
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-2xl rounded-2xl p-6 border border-white/10 shadow-xl hover:border-blue-500/30 transition-all group">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Avg. Volatility</div>
              <Activity className="w-4 h-4 text-blue-400 opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="text-4xl font-extralight text-white">
              {risk.length > 0 ? (risk.reduce((a, b) => a + b.volatility, 0) / risk.length).toFixed(1) : "0"}%
            </div>
            <div className="text-xs text-yellow-400 mt-2">Moderates Risiko</div>
          </div>
        </div>
      </div>
    </div>
  );
}