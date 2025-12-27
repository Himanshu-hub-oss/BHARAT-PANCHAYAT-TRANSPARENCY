import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function ProgressLine({ timeline }) {
  const labels = timeline.map((p) => p.name);
  const progress = timeline.map((p) => p.progress_percent);

  const data = {
    labels,
    datasets: [
      {
        label: "Progress %",
        data: progress,
        borderColor: "#6366f1",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointBackgroundColor: "#fff",
        pointBorderWidth: 3,
      },
    ],
  };

  const options = {
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: { grid: { display: false } },
      y: { min: 0, max: 100, grid: { color: 'rgba(0,0,0,0.05)' } }
    },
    maintainAspectRatio: false,
    responsive: true,
  };

  return <Line data={data} options={options} />;
}
