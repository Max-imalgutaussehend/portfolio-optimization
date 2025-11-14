"use client";

import { useEffect, useState } from "react";
import { api } from "./../services/apiClient";

// Chart.js Registration
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
} from "chart.js";
import { Line } from "react-chartjs-2";

// Register required elements
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

ChartJS.defaults.color = "#ffffff";            // Text
ChartJS.defaults.borderColor = "rgba(255,255,255,0.2)";

export default function Home() {
  const [prices, setPrices] = useState([]);

  useEffect(() => {
    api.get("/prices").then((res) => setPrices(res.data));
  }, []);

  const data = {
    labels: prices.map((p: any) => p.date),
    datasets: [
      {
        label: "Price",
        data: prices.map((p: any) => p.price),
      },
    ],
  };

  return (
    <div>
      <h1>Portfolio Skeleton</h1>
      <Line data={data} />
    </div>
  );
}
