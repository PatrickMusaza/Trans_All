import React, { useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  BarController,
  LineController,
  PieController,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./Chart.css"

ChartJS.register(
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  BarController,
  LineController,
  PieController,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const Chart = ({ chartType = "bar", xField, yField, tableData }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    // Extract labels and data from tableData
    const labels = tableData.map((item) => item[xField]);
    const data = tableData.map((item) => item[yField]);

    // Destroy existing chart instance if present
    if (ChartJS.getChart(ctx)) {
      ChartJS.getChart(ctx).destroy();
    }

    // Chart configuration
    new ChartJS(ctx, {
      type: chartType,
      data: {
        labels,
        datasets: [
          {
            label: `${yField} by ${xField}`,
            data,
            backgroundColor: [
              "#4caf50",
              "#ff9800",
              "#f44336",
              "#2196f3",
              "#9c27b0",
              "#D41200FF",
              "#04241FFF",
            ],
            borderColor: "#ffffff",
            borderWidth: 1,
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
          tooltip: {
            callbacks: {
              label: (tooltipItem) =>
                `${tooltipItem.label}: ${tooltipItem.raw}`,
            },
          },
        },
        scales:
          chartType === "pie"
            ? {} // No scales for pie chart
            : {
              x: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: xField,
                },
              },
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: yField,
                },
              },
            },
      },
    });
  }, [chartType, xField, yField, tableData]);

  return (
    <div className="chart-container-dashboard" style={{ height: "400px", width: "100%" }}>
      <h2> {
        chartType == "bar" ?
          "Trips Overview" :
          "Quick Stats"
      }
      </h2>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default Chart;
