"use client";

import { useEffect, useState, useRef } from "react";
import { TrendingUp, BarChart2, Shield, Zap, ArrowRight, Activity } from "lucide-react";
import LiquidEther from "../components/liquidEther";

interface PerformanceData {
  date: string;
  totalReturn: number;
  volatility: number;
  sharpe: number;
}

interface AllocationData {
  symbol: string;
  weight: number;
  sector: string;
}

interface RiskData {
  symbol: string;
  riskContribution: number;
  beta: number;
}

interface OptimizationData {
  symbol: string;
  currentWeight: number;
  optimizedWeight: number;
}



export default function PortfolioOptimization() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [activeTab, setActiveTab] = useState("performance");
  const [loading, setLoading] = useState(false);

  // Data states
  const [performance, setPerformance] = useState<PerformanceData[]>([]);
  const [allocation, setAllocation] = useState<AllocationData[]>([]);
  const [risk, setRisk] = useState<RiskData[]>([]);
  const [optimization, setOptimization] = useState<OptimizationData[]>([]);

  useEffect(() => {
    if (!showWelcome) {
      setLoading(true);
      setTimeout(() => {
        setPerformance([
          { date: "Jan", totalReturn: 5.2, volatility: 12.3, sharpe: 1.2 },
          { date: "Feb", totalReturn: 7.8, volatility: 13.1, sharpe: 1.4 },
          { date: "Mar", totalReturn: 12.4, volatility: 11.8, sharpe: 1.6 },
          { date: "Apr", totalReturn: 10.1, volatility: 14.2, sharpe: 1.3 },
          { date: "May", totalReturn: 15.6, volatility: 12.9, sharpe: 1.7 }
        ]);
        setAllocation([
          { symbol: "AAPL", weight: 25, sector: "Technology" },
          { symbol: "GOOGL", weight: 20, sector: "Technology" },
          { symbol: "MSFT", weight: 30, sector: "Technology" },
          { symbol: "JPM", weight: 15, sector: "Finance" },
          { symbol: "JNJ", weight: 10, sector: "Healthcare" }
        ]);
        setRisk([
          { symbol: "AAPL", riskContribution: 22, beta: 1.15 },
          { symbol: "GOOGL", riskContribution: 18, beta: 1.08 },
          { symbol: "MSFT", riskContribution: 28, beta: 0.95 },
          { symbol: "JPM", riskContribution: 20, beta: 1.22 },
          { symbol: "JNJ", riskContribution: 12, beta: 0.78 }
        ]);
        setOptimization([
          { symbol: "AAPL", currentWeight: 25, optimizedWeight: 22 },
          { symbol: "GOOGL", currentWeight: 20, optimizedWeight: 18 },
          { symbol: "MSFT", currentWeight: 30, optimizedWeight: 35 },
          { symbol: "JPM", currentWeight: 15, optimizedWeight: 15 },
          { symbol: "JNJ", currentWeight: 10, optimizedWeight: 10 }
        ]);
        setLoading(false);
      }, 800);
    }
  }, [showWelcome]);

  const PerformanceView = () => {
    const latestData = performance[performance.length - 1] || { totalReturn: 0, volatility: 0, sharpe: 0 };
    
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <div className="text-xs text-zinc-500 mb-2 font-medium uppercase tracking-wider">Total Return</div>
            <div className="text-3xl font-bold text-emerald-400">+{latestData.totalReturn}%</div>
            <div className="text-xs text-emerald-500 mt-2">↑ Cumulative gain</div>
          </div>
          <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <div className="text-xs text-zinc-500 mb-2 font-medium uppercase tracking-wider">Volatility (20d)</div>
            <div className="text-3xl font-bold text-orange-400">{latestData.volatility}%</div>
            <div className="text-xs text-zinc-500 mt-2">Rolling volatility</div>
          </div>
          <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <div className="text-xs text-zinc-500 mb-2 font-medium uppercase tracking-wider">Sharpe Ratio</div>
            <div className="text-3xl font-bold text-blue-400">{latestData.sharpe}</div>
            <div className="text-xs text-blue-500 mt-2">Risk-adjusted return</div>
          </div>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-xl p-8">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-1">Cumulative Return</h3>
            <p className="text-sm text-zinc-400">Portfolio value over time</p>
          </div>
          <div className="h-64">
            <svg className="w-full h-full" viewBox="0 0 800 240" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="returnGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="rgba(16,185,129,0.3)" />
                  <stop offset="100%" stopColor="rgba(16,185,129,0)" />
                </linearGradient>
              </defs>
              
              {[0, 1, 2, 3].map(i => (
                <line key={i} x1="40" y1={i * 60} x2="760" y2={i * 60} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              ))}

              <path
                d={`M 40 ${240 - (performance[0]?.totalReturn || 0) * 10} ${performance
                  .map((d, i) => `L ${40 + (i / (performance.length - 1)) * 720} ${240 - d.totalReturn * 10}`)
                  .join(" ")} L 760 240 L 40 240 Z`}
                fill="url(#returnGradient)"
              />

              <path
                d={`M 40 ${240 - (performance[0]?.totalReturn || 0) * 10} ${performance
                  .map((d, i) => `L ${40 + (i / (performance.length - 1)) * 720} ${240 - d.totalReturn * 10}`)
                  .join(" ")}`}
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
              />

              {performance.map((d, i) => (
                <g key={i}>
                  <circle cx={40 + (i / (performance.length - 1)) * 720} cy={240 - d.totalReturn * 10} r="5" fill="#18181b" stroke="#10b981" strokeWidth="2.5" />
                  <text x={40 + (i / (performance.length - 1)) * 720} y="235" textAnchor="middle" fill="#71717a" fontSize="12" fontWeight="500">{d.date}</text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-white mb-4">Rolling Volatility</h3>
            <div className="space-y-3">
              {performance.map((d, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">{d.date}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full" style={{ width: `${(d.volatility / 20) * 100}%` }} />
                    </div>
                    <span className="text-sm font-medium text-white w-12 text-right">{d.volatility}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-white mb-4">Sharpe Ratio Trend</h3>
            <div className="space-y-3">
              {performance.map((d, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm text-zinc-400">{d.date}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full" style={{ width: `${(d.sharpe / 2) * 100}%` }} />
                    </div>
                    <span className="text-sm font-medium text-white w-12 text-right">{d.sharpe}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AllocationView = () => {
    const sectorData = allocation.reduce((acc, item) => {
      acc[item.sector] = (acc[item.sector] || 0) + item.weight;
      return acc;
    }, {} as Record<string, number>);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-xl p-8">
            <h3 className="text-lg font-semibold text-white mb-6">Current Weights</h3>
            <div className="space-y-5">
              {allocation.map((item, i) => {
                const colors = ["#8b5cf6", "#ec4899", "#f97316", "#eab308", "#10b981"];
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: colors[i] + '30', border: `2px solid ${colors[i]}` }}>
                          {item.symbol.slice(0, 2)}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{item.symbol}</div>
                          <div className="text-xs text-zinc-500">{item.sector}</div>
                        </div>
                      </div>
                      <div className="text-lg font-bold text-white">{item.weight}%</div>
                    </div>
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${item.weight}%`, backgroundColor: colors[i] }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-xl p-8">
            <h3 className="text-lg font-semibold text-white mb-6">Sector Allocation</h3>
            <div className="space-y-5">
              {Object.entries(sectorData).map(([sector, weight], i) => {
                const colors = ["#3b82f6", "#8b5cf6", "#ec4899"];
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-zinc-300">{sector}</span>
                      <span className="text-lg font-bold text-white">{weight}%</span>
                    </div>
                    <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${weight}%`, backgroundColor: colors[i] }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const RiskView = () => {
    return (
      <div className="space-y-6">
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-xl p-8">
          <h3 className="text-lg font-semibold text-white mb-6">Risk Contribution per Asset</h3>
          <div className="space-y-5">
            {risk.map((item, i) => {
              const riskLevel = item.riskContribution > 25 ? 'high' : item.riskContribution > 15 ? 'medium' : 'low';
              const color = riskLevel === 'high' ? '#ef4444' : riskLevel === 'medium' ? '#f59e0b' : '#10b981';
              
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center border border-white/10">
                        <span className="text-sm font-bold text-white">{item.symbol}</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-white">{item.symbol}</div>
                        <div className="text-xs text-zinc-500 capitalize">{riskLevel} risk</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-white">{item.riskContribution}%</div>
                      <div className="text-xs text-zinc-500">contribution</div>
                    </div>
                  </div>
                  <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${item.riskContribution}%`, backgroundColor: color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-xl p-8">
          <h3 className="text-lg font-semibold text-white mb-6">Beta vs. Benchmark</h3>
          <div className="space-y-3">
            {risk.map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg border border-white/5">
                <span className="text-sm font-medium text-white">{item.symbol}</span>
                <div className="flex items-center gap-4">
                  <span className={`text-sm font-bold ${item.beta > 1 ? 'text-red-400' : 'text-green-400'}`}>
                    β = {item.beta.toFixed(2)}
                  </span>
                  <span className="text-xs text-zinc-500">{item.beta > 1 ? 'More volatile' : 'Less volatile'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const OptimizationView = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <div className="text-xs text-zinc-500 mb-2 font-medium uppercase tracking-wider">Expected Improvement</div>
            <div className="text-3xl font-bold text-emerald-400">+2.3%</div>
            <div className="text-xs text-zinc-500 mt-2">Projected Sharpe increase</div>
          </div>
          <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-xl p-6">
            <div className="text-xs text-zinc-500 mb-2 font-medium uppercase tracking-wider">Risk Reduction</div>
            <div className="text-3xl font-bold text-blue-400">-1.8%</div>
            <div className="text-xs text-zinc-500 mt-2">Volatility decrease</div>
          </div>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-xl p-8">
          <h3 className="text-lg font-semibold text-white mb-2">Weight Allocation: Current vs. Optimized</h3>
          <p className="text-sm text-zinc-400 mb-6">Maximum Sharpe Ratio optimization</p>
          <div className="space-y-6">
            {optimization.map((item, i) => {
              const diff = item.optimizedWeight - item.currentWeight;
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-zinc-800 rounded-lg flex items-center justify-center border border-white/10">
                        <span className="text-sm font-bold text-white">{item.symbol}</span>
                      </div>
                      <div className="text-sm font-medium text-white">{item.symbol}</div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-xs text-zinc-500">Current</div>
                        <div className="text-sm font-bold text-zinc-400">{item.currentWeight}%</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-zinc-500">Optimized</div>
                        <div className="text-sm font-bold text-emerald-400">{item.optimizedWeight}%</div>
                      </div>
                      <div className={`text-sm font-bold w-16 text-right ${diff > 0 ? 'text-emerald-400' : diff < 0 ? 'text-red-400' : 'text-zinc-500'}`}>
                        {diff > 0 ? '+' : ''}{diff}%
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <div className="text-xs text-zinc-600 mb-1">Current</div>
                      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-zinc-600 rounded-full" style={{ width: `${item.currentWeight}%` }} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-zinc-600 mb-1">Optimized</div>
                      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${item.optimizedWeight}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

if (showWelcome) {
  return (
    <div className="relative min-h-screen bg-zinc-950 overflow-hidden">
      {/* Ether Background */}
      <div className="absolute inset-0 z-0">
        <LiquidEther
          className="w-full h-full"
          colors={['#5227FF', '#FF9FFC', '#B19EEF']}
        />
      </div>

      {/* Content über dem Ether */}
      <div className="relative z-10 flex flex-col min-h-screen items-center justify-center p-8">
        <div className="max-w-5xl w-full text-center space-y-12">
          <div className="inline-flex items-center gap-3 px-5 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full">
            <Activity className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-medium text-zinc-300 uppercase tracking-wide">
              Quantitative Portfolio Analysis
            </span>
          </div>

          <div>
            <h1 className="text-8xl font-bold text-white mb-6 tracking-tight">
              Portfolio Optimization
            </h1>
            <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
              Advanced quantitative analysis with real-time optimization algorithms
            </p>
          </div>

          <div className="grid grid-cols-4 gap-4 max-w-5xl mx-auto">
            {/* Tab Cards */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-7 h-7 text-emerald-400" strokeWidth={2} />
              </div>
              <div className="text-2xl font-bold text-white mb-2">Performance</div>
              <div className="text-xs text-zinc-500">Cumulative returns & metrics</div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500/20 to-purple-500/5 rounded-xl flex items-center justify-center mx-auto mb-4">
                <BarChart2 className="w-7 h-7 text-purple-400" strokeWidth={2} />
              </div>
              <div className="text-2xl font-bold text-white mb-2">Allocation</div>
              <div className="text-xs text-zinc-500">Asset & sector distribution</div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500/20 to-orange-500/5 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-7 h-7 text-orange-400" strokeWidth={2} />
              </div>
              <div className="text-2xl font-bold text-white mb-2">Risk</div>
              <div className="text-xs text-zinc-500">Volatility & correlation</div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center hover:bg-white/10 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500/20 to-blue-500/5 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-7 h-7 text-blue-400" strokeWidth={2} />
              </div>
              <div className="text-2xl font-bold text-white mb-2">Optimize</div>
              <div className="text-xs text-zinc-500">Maximum Sharpe ratio</div>
            </div>
          </div>

          <button
            onClick={() => setShowWelcome(false)}
            className="group inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-xl transition-all shadow-2xl shadow-purple-600/30 hover:shadow-purple-600/50 hover:scale-105"
          >
            Launch Dashboard
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}


  return (
    <div className="min-h-screen bg-zinc-950">
      <div className="border-b border-white/10 bg-zinc-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Portfolio Optimization</h1>
                <p className="text-xs text-zinc-400">Quantitative analysis dashboard</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="flex gap-2 mb-8 p-1 bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-xl w-fit">
          {[
            { id: "performance", label: "Performance", icon: TrendingUp },
            { id: "allocation", label: "Allocation", icon: BarChart2 },
            { id: "risk", label: "Risk Analysis", icon: Shield },
            { id: "optimization", label: "Optimization", icon: Zap }
          ].map(tab => (
            <button
              key={tab.id}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-sm transition-all ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-600/30"
                  : "text-zinc-400 hover:text-white hover:bg-white/5"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon className="w-4 h-4" strokeWidth={2.5} />
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-96 bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl">
            <div className="w-12 h-12 border-4 border-zinc-800 border-t-purple-500 rounded-full animate-spin mb-4" />
            <p className="text-zinc-400 text-sm">Loading portfolio data...</p>
          </div>
        ) : (
          <div>
            {activeTab === "performance" && <PerformanceView />}
            {activeTab === "allocation" && <AllocationView />}
            {activeTab === "risk" && <RiskView />}
            {activeTab === "optimization" && <OptimizationView />}
          </div>
        )}
      </div>
    </div>
  );
}