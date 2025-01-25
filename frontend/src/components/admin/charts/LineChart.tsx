import { useEffect, useRef } from 'react';
import type {
  ChartData,
  ChartOptions,
  Chart as ChartJS,
  TooltipItem,
} from 'chart.js';
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface LineChartProps {
  data: {
    labels: string[];
    values: number[];
  };
  title: string;
  color?: string;
  fillColor?: string;
}

const LineChart = ({
  data,
  title,
  color = '#4F46E5',
  fillColor = 'rgba(79, 70, 229, 0.1)',
}: LineChartProps) => {
  const chartRef = useRef<ChartJS<'line'>>(null);

  const chartData: ChartData<'line'> = {
    labels: data.labels,
    datasets: [
      {
        label: title,
        data: data.values,
        borderColor: color,
        backgroundColor: fillColor,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: color,
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: color,
        pointHoverBorderColor: '#fff',
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context: TooltipItem<'line'>) => `${context.parsed.y.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
          },
          color: '#6B7280',
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          font: {
            size: 12,
          },
          color: '#6B7280',
          callback: (value: number | string) => value.toLocaleString(),
        },
      },
    },
    interaction: {
      mode: 'nearest',
      axis: 'x',
      intersect: false,
    },
    elements: {
      line: {
        borderWidth: 2,
      },
    },
  };

  useEffect(() => {
    const chart = chartRef.current;

    if (chart) {
      const gradient = chart.ctx.createLinearGradient(0, 0, 0, chart.height);
      gradient.addColorStop(0, fillColor);
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      chart.data.datasets[0].backgroundColor = gradient;
      chart.update();
    }
  }, [fillColor]);

  return (
    <div className="relative h-full w-full">
      <Line ref={chartRef} data={chartData} options={options} />
    </div>
  );
};

export default LineChart;
