// Fix: Added full content for GaugeChart.tsx
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
  Plugin,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

interface GaugeChartProps {
  score: number;
  benchmarkScore?: number;
}

const benchmarkMarkerPlugin: Plugin<'doughnut'> = {
    id: 'benchmarkMarker',
    afterDraw: (chart) => {
        const benchmarkScore = (chart.config.options as any)?.benchmarkScore;
        if (typeof benchmarkScore === 'undefined') return;
        
        const { ctx, chartArea: { top, bottom, left, right } } = chart;
        const meta = chart.getDatasetMeta(0);
        const angle = Math.PI + (Math.PI * (benchmarkScore / 100));
        
        const centerX = (left + right) / 2;
        const centerY = (top + bottom) * 0.93 + top * 0.07; // Adjusted to align with the Doughnut
        
        // This is a bit of a magic number, found through trial and error to place the marker correctly on the arc
        const outerRadius = Math.min(right-left, bottom-top) / 2 * 0.82; 

        const x = centerX + Math.cos(angle) * outerRadius;
        const y = centerY + Math.sin(angle) * outerRadius;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle + Math.PI / 2);

        // Draw the triangle marker
        ctx.beginPath();
        ctx.moveTo(0, -5); // Top point
        ctx.lineTo(-5, 5); // Bottom left
        ctx.lineTo(5, 5); // Bottom right
        ctx.closePath();
        ctx.fillStyle = '#64748b'; // slate-500
        ctx.fill();
        
        ctx.restore();
    }
};

const GaugeChart: React.FC<GaugeChartProps> = ({ score, benchmarkScore }) => {
  const scoreColor = '#4f46e5'; // indigo-600

  const data: ChartData<'doughnut'> = {
    labels: ['Score', 'Remaining'],
    datasets: [
      {
        data: [score, 100 - score],
        backgroundColor: [scoreColor, '#e2e8f0'], // slate-200
        borderColor: ['#ffffff', '#ffffff'],
        borderWidth: 2,
        circumference: 180,
        rotation: 270,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> & { benchmarkScore?: number } = {
    responsive: true,
    maintainAspectRatio: false,
    rotation: -90,
    circumference: 180,
    cutout: '65%',
    animation: false,
    benchmarkScore: benchmarkScore,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  return (
    <div className="relative w-full max-w-xs mx-auto h-40">
      <Doughnut data={data} options={options} plugins={[benchmarkMarkerPlugin]} />
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-4">
        <span className="text-6xl font-bold" style={{color: scoreColor}}>{score}</span>
        <span className="text-sm text-slate-500 font-medium -mt-1">Overall Score</span>
      </div>
       {typeof benchmarkScore !== 'undefined' && (
        <div className="absolute bottom-0 right-0 left-0 flex items-center justify-center gap-2 text-xs text-slate-500">
          <div className="w-2 h-2 rotate-45 bg-slate-500 transform"></div>
          <span>Peer Benchmark: {benchmarkScore}</span>
        </div>
      )}
    </div>
  );
};

export default GaugeChart;
