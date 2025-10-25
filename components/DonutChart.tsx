import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js';
import { AssessmentResult } from '../types';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DonutChartProps {
  recommendations: AssessmentResult['recommendations'];
}

const DonutChart: React.FC<DonutChartProps> = ({ recommendations }) => {
    const priorityCounts = recommendations.reduce((acc, rec) => {
        acc[rec.priority] = (acc[rec.priority] || 0) + 1;
        return acc;
    }, {} as Record<'High' | 'Medium' | 'Low', number>);

  const data: ChartData<'doughnut'> = {
    labels: ['High Priority', 'Medium Priority', 'Low Priority'],
    datasets: [
      {
        data: [
            priorityCounts.High || 0,
            priorityCounts.Medium || 0,
            priorityCounts.Low || 0
        ],
        backgroundColor: [
          '#ef4444', // red-500
          '#f59e0b', // amber-500
          '#22c55e', // green-500
        ],
        borderColor: '#ffffff',
        borderWidth: 3,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    animation: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
             font: {
                family: 'Inter, sans-serif',
                size: 12,
            },
            color: '#475569' // slate-600
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed || 0;
            return `${label}: ${value}`;
          }
        }
      }
    },
  };

  return (
    <div className="relative h-52 w-52 mx-auto">
      <Doughnut data={data} options={options} />
    </div>
  );
};

export default DonutChart;
