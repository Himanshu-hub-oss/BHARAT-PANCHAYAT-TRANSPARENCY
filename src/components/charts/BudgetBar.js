import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function BudgetBar({ projects }) {
  const labels = projects.map((p) => p.name);
  const budget = projects.map((p) => p.budget);
  const spent = projects.map((p) => p.spent);

  const data = {
    labels,
    datasets: [
      {
        label: "Budget",
        data: budget,
        backgroundColor: "rgba(99, 102, 241, 0.8)",
        borderRadius: 8,
      },
      {
        label: "Spent",
        data: spent,
        backgroundColor: "rgba(16, 185, 129, 0.8)",
        borderRadius: 8,
      },
    ],
  };

  const options = {
    plugins: {
      legend: { position: 'top', labels: { font: { weight: 'bold' } } }
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: 'rgba(0,0,0,0.05)' } }
    },
    maintainAspectRatio: false,
    responsive: true,
  };

  return <Bar data={data} options={options} />;
}
