import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { TimeSeriesDataPoint } from '@/api/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface TimeSeriesChartProps {
  data: TimeSeriesDataPoint[];
  title?: string;
  metricName?: string;
}

const TimeSeriesChart = ({ data, title = 'Time Series Analysis', metricName = 'Value' }: TimeSeriesChartProps) => {
  const chartRef = useRef<ChartJS<'line'>>(null);

  const actualData = data.filter((d) => !d.is_forecast);
  const forecastData = data.filter((d) => d.is_forecast);

  // Primary green color from our design system
  const primaryColor = 'hsl(152, 45%, 28%)';
  const primaryColorLight = 'hsla(152, 45%, 28%, 0.1)';
  // Accent golden color for forecast
  const accentColor = 'hsl(42, 85%, 55%)';
  const accentColorLight = 'hsla(42, 85%, 55%, 0.1)';

  const chartData = {
    labels: data.map((d) => d.date),
    datasets: [
      {
        label: `Actual ${metricName}`,
        data: data.map((d) => (d.is_forecast ? null : d.value)),
        borderColor: primaryColor,
        backgroundColor: primaryColorLight,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: primaryColor,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
      {
        label: `Forecast ${metricName}`,
        data: data.map((d, index) => {
          if (d.is_forecast) return d.value;
          // Connect forecast to last actual point
          if (index === actualData.length - 1 && forecastData.length > 0) return d.value;
          return null;
        }),
        borderColor: accentColor,
        backgroundColor: accentColorLight,
        fill: true,
        tension: 0.4,
        borderDash: [5, 5],
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: accentColor,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            family: 'DM Sans',
            size: 13,
          },
        },
      },
      title: {
        display: true,
        text: title,
        font: {
          family: 'Plus Jakarta Sans',
          size: 18,
          weight: 'bold',
        },
        padding: { bottom: 20 },
      },
      tooltip: {
        backgroundColor: 'hsl(150, 30%, 15%)',
        titleFont: { family: 'Plus Jakarta Sans', size: 14 },
        bodyFont: { family: 'DM Sans', size: 13 },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: 'DM Sans',
            size: 11,
          },
          maxRotation: 45,
          minRotation: 45,
        },
      },
      y: {
        grid: {
          color: 'hsla(140, 15%, 88%, 0.5)',
        },
        ticks: {
          font: {
            family: 'DM Sans',
            size: 11,
          },
        },
      },
    },
  };

  useEffect(() => {
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[400px] bg-muted/30 rounded-lg border border-border">
        <p className="text-muted-foreground">No data available. Generate an analysis to view the chart.</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl border border-border p-6 shadow-md">
      <div className="h-[400px]">
        <Line ref={chartRef} data={chartData} options={options} />
      </div>
    </div>
  );
};

export default TimeSeriesChart;
