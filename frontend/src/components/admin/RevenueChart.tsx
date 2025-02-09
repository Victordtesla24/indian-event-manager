import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

interface RevenueChartProps {
  data: {
    labels: string[];
    revenue: number[];
    tickets: number[];
  };
}

const RevenueChart = ({ data }: RevenueChartProps) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: data.labels,
        datasets: [
          {
            label: "Revenue (₹)",
            data: data.revenue,
            backgroundColor: "rgba(79, 70, 229, 0.8)",
            borderColor: "rgb(79, 70, 229)",
            borderWidth: 1,
            yAxisID: "y",
          },
          {
            label: "Tickets Sold",
            data: data.tickets,
            backgroundColor: "rgba(59, 130, 246, 0.8)",
            borderColor: "rgb(59, 130, 246)",
            borderWidth: 1,
            yAxisID: "y1",
          },
        ],
      },
      options: {
        responsive: true,
        interaction: {
          mode: "index",
          intersect: false,
        },
        plugins: {
          title: {
            display: true,
            text: "Revenue & Ticket Sales",
          },
          tooltip: {
            mode: "index",
            intersect: false,
            callbacks: {
              label: (context) => {
                const label = context.dataset.label || "";
                const value = context.parsed.y;
                if (label.includes("Revenue")) {
                  return `${label}: ₹${value.toLocaleString()}`;
                }
                return `${label}: ${value}`;
              },
            },
          },
        },
        scales: {
          y: {
            type: "linear",
            display: true,
            position: "left",
            title: {
              display: true,
              text: "Revenue (₹)",
            },
            ticks: {
              callback: (value) => `₹${value}`,
            },
          },
          y1: {
            type: "linear",
            display: true,
            position: "right",
            title: {
              display: true,
              text: "Tickets Sold",
            },
            grid: {
              drawOnChartArea: false,
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <canvas ref={chartRef} />
    </div>
  );
};

export default RevenueChart;
