"use client";

import { useEffect, useState } from "react";
import { api } from "./../services/apiClient";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";
import { Line, Bar, Scatter } from "react-chartjs-2";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, BarElement);
ChartJS.defaults.color = "#ffffff";
ChartJS.defaults.borderColor = "rgba(255,255,255,0.2)";

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
  const [activeTab, setActiveTab] = useState("performance");
  const [prices, setPrices] = useState<Price[]>([]);
  const [weights, setWeights] = useState<Weight[]>([]);
  const [risk, setRisk] = useState<Risk[]>([]);
  const [optimization, setOptimization] = useState<Optimization[]>([]);

  useEffect(() => {
    api.get("/prices").then(res => setPrices(res.data));
    api.get("/weights").then(res => setWeights(res.data));
    api.get("/risk").then(res => setRisk(res.data));
    api.get("/optimization").then(res => setOptimization(res.data));
  }, []);

  // Chart Data
  const performanceData = {
    labels: prices.map(p => p.date),
    datasets: [
      { label: "Portfolio Value", data: prices.map(p => p.price), borderColor: "#4ade80", backgroundColor: "rgba(74,222,128,0.2)" }
    ]
  };

  const allocationData = {
    labels: weights.map(w => w.symbol),
    datasets: [
      { label: "Current Weight", data: weights.map(w => w.weight), backgroundColor: "rgba(96,165,250,0.7)" }
    ]
  };

  const riskData = {
    labels: risk.map(r => r.symbol),
    datasets: [
      { label: "Volatility Contribution", data: risk.map(r => r.volatility), backgroundColor: "rgba(250,96,96,0.7)" }
    ]
  };

  const optimizationData = {
    labels: optimization.map(o => o.symbol),
    datasets: [
      { label: "Optimized Weight", data: optimization.map(o => o.weight), backgroundColor: "rgba(250,204,21,0.7)" }
    ]
  };

  return (
    <div className="px-8 py-4">
      {/* Landing Section */}
      <section className="mb-6">
        <h1 className="text-3xl font-bold">Portfolio Dashboard</h1>
        <p className="text-gray-300">Interactive visualizations for performance, allocation, risk, and optimization.</p>
      </section>

      {/* Tabs */}
      <section className="mb-4">
        {["performance", "allocation", "risk", "optimization"].map(tab => (
          <button
            key={tab}
            className={`px-4 py-2 mr-2 rounded ${activeTab === tab ? "bg-blue-500" : "bg-gray-700"}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </section>

      {/* Chart Section */}
      <section>
        {activeTab === "performance" && <Line data={performanceData} />}
        {activeTab === "allocation" && <Bar data={allocationData} />}
        {activeTab === "risk" && <Bar data={riskData} />}
        {activeTab === "optimization" && <Bar data={optimizationData} />}
      </section>
    </div>
  );
}
