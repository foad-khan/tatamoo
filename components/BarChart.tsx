import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js';
import { CategoryScore } from '../types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  scores: CategoryScore[];
  benchmarkScores?: CategoryScore[];
}

const BarChart: React.FC<BarChartProps> = ({ scores, benchmarkScores }) => {
  const sortedScores = [...scores].sort((a, b) => b.score - a.score);

  const datasets: ChartData<'bar'>['datasets'] = [
    {
      label: 'Your Score',
      data: sortedScores.map(s => s.score),
      backgroundColor: 'rgba(99, 102, 241, 0.8)', // indigo-500
      borderColor: 'rgba(79, 70, 229, 1)', // indigo-600
      borderWidth: 1,
    },
  ];

  if (benchmarkScores) {
    datasets.push({
      label: 'Peer Benchmark',
      data: sortedScores.map(s => {
        const benchmark = benchmarkScores.find(bs => bs.category === s.category);
        return benchmark ? benchmark.score : 0;
      }),
      backgroundColor: 'rgba(203, 213, 225, 0.7)', // slate-300
      borderColor: 'rgba(148, 163, 184, 1)', // slate-400
      borderWidth: 1,
    });
  }

  const data: ChartData<'bar'> = {
    labels: sortedScores.map(s => s.category),
    datasets: datasets,
  };

  const options: ChartOptions<'bar'> = {
    indexAxis: 'y' as const,
    elements: {
      bar: {
        borderRadius: 4,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
        x: {
            beginAtZero: true,
            max: 100,
            grid: {
                drawOnChartArea: true,
                color: '#f1f5f9' // slate-100
            },
            ticks: {
                 font: {
                    family: 'Inter, sans-serif'
                },
                color: '#64748b' // slate-500
            }
        },
        y: {
            grid: {
                display: false
            },
            ticks: {
                font: {
                    family: 'Inter, sans-serif'
                },
                color: '#334155' // slate-700
            }
        }
    },
    plugins: {
      legend: {
        display: !!benchmarkScores,
        position: 'bottom' as const,
        labels: {
            font: {
                family: 'Inter, sans-serif',
                size: 12,
            },
            color: '#475569' // slate-600
        }
      },
      title: {
        display: false,
      },
    },
    animation: false,
  };

  return (
    <div className="relative h-96">
      <Bar options={options} data={data} />
    </div>
  );
};

export default BarChart;
