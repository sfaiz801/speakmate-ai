'use client';

import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

/**
 * Lightweight Chart.js wrapper for Bar, Line, and Doughnut charts.
 */
export default function ProgressChart({ type = 'bar', data, options = {}, height = 240 }) {
  const canvasRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data) return undefined;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const ctx = canvas.getContext('2d');
    chartInstanceRef.current = new Chart(ctx, {
      type,
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: type === 'doughnut',
            position: 'bottom',
          },
          tooltip: {
            backgroundColor: '#0f172a',
            padding: 10,
            cornerRadius: 8,
          },
          ...(options.plugins || {}),
        },
        scales:
          type === 'doughnut'
            ? undefined
            : {
                x: {
                  grid: { display: false },
                  ticks: { color: '#64748b', font: { size: 12 } },
                },
                y: {
                  beginAtZero: true,
                  grid: { color: '#f1f5f9' },
                  ticks: { color: '#64748b', font: { size: 12 } },
                },
                ...(options.scales || {}),
              },
        ...options,
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [type, data, options]);

  return (
    <div style={{ position: 'relative', width: '100%', height }}>
      <canvas ref={canvasRef} />
    </div>
  );
}
