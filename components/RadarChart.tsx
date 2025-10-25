
// Fix: Added full content for RadarChart.tsx
import React from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js';
import { CategoryScore } from '../types';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

interface RadarChartProps {
  scores: CategoryScore[];
}

const RadarChart: React.FC<RadarChartProps> = ({ scores }) => {
  const data: ChartData<'radar'> = {
    labels: scores.map(s => s.category),
    datasets: [
      {
        label: 'Maturity Score',
        data: scores.map(s => s.score),
        backgroundColor: 'rgba(79, 70, 229, 0.2)',
        borderColor: 'rgba(79, 70, 229, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(79, 70, 229, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(79, 70, 229, 1)',
      },
    ],
  };

  const options: ChartOptions<'radar'> = {
    scales: {
      r: {
        angleLines: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        pointLabels: {
          font: {
            size: 12,
            family: 'Inter, sans-serif'
          },
          color: '#334155', // slate-700
        },
        ticks: {
          backdropColor: 'transparent',
          color: '#64748b', // slate-500
          stepSize: 20,
           font: {
            family: 'Inter, sans-serif'
          },
        },
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.formattedValue}`,
        },
      },
    },
    animation: false, // Disable animations for reliable PDF generation
    maintainAspectRatio: false,
  };

  return (
    <div className="relative h-64 sm:h-80">
      <Radar data={data} options={options} />
    </div>
  );
};

export default RadarChart;
