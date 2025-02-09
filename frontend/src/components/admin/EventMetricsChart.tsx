import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

interface EventMetric {
  category: string;
  count: number;
}

interface EventMetricsChartProps {
  data: EventMetric[];
  title?: string;
}

const EventMetricsChart = ({ data, title = "Event Distribution" }: EventMetricsChartProps) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    const colors = [
      "rgba(79, 70, 229, 0.8)",
      "rgba(59, 130, 246, 0.8)",
      "rgba(16, 185, 129, 0.8)",
      "rgba(245, 158, 11, 0.8)",
      "rgba(239, 68, 68, 0.8)",
      "rgba(139, 92, 246, 0.8)",
    ];

    chartInstance.current = new Chart(ctx, {
      type: "pie",
      data: {
        labels: data.map((item) => item.category),
        datasets: [
          {
            data: data.map((item) => item.count),
            backgroundColor: colors.slice(0, data.length),
            borderColor: colors.map((color) => color.replace("0.8", "1")),
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "right",
          },
          title: {
            display: true,
            text: title,
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || "";
                const value = context.parsed;
                const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                const percentage = ((value * 100) / total).toFixed(1);
                return `${label}: ${value} (${percentage}%)`;
              },
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
  }, [data, title]);

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <canvas ref={chartRef} />
    </div>
  );
};

export default EventMetricsChart;
