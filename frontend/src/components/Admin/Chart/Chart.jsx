import React, { useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const Chart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    // Destroy existing chart instance if present
    if (ChartJS.getChart(ctx)) {
      ChartJS.getChart(ctx).destroy();
    }

    new ChartJS(ctx, {
      type: "line",
      data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "Earnings ($)",
            data: [400, 600, 800, 500, 700, 900, 1000],
            borderColor: "#1a2f79",
            backgroundColor: "rgba(26, 47, 121, 0.1)",
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "top",
          },
        },
        scales: {
          x: {
            beginAtZero: true,
          },
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }, []);

  return (
    <div style={{ height: "300px", width: "100%" }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default Chart;
