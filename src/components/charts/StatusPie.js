import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function StatusPie({ completed, ongoing, delayed }) {
  const data = {
    labels: ["Completed", "Ongoing", "Delayed"],
    datasets: [
      {
        data: [completed, ongoing, delayed],
        backgroundColor: ["#10b981", "#6366f1", "#f43f5e"],
        borderWidth: 0,
        hoverOffset: 15,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: 'bottom',
        labels: { font: { weight: 'bold', size: 10 }, padding: 20 }
      }
    },
    maintainAspectRatio: false
  };

  return <Pie data={data} options={options} />;
}
