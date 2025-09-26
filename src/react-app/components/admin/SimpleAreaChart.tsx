"use client";
import React from "react";

interface AreaChartProps {
  title?: string;
  data: number[]; // 12 points for months
  labels?: string[]; // optional labels
  height?: number;
}

export default function SimpleAreaChart({ title = "Bookings Trend", data, labels, height = 220 }: AreaChartProps) {
  const max = Math.max(10, ...data);
  const width = 520;
  const padding = 24;
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * innerW + padding;
    const y = height - padding - (v / max) * innerH;
    return `${x},${y}`;
  }).join(" ");

  // Build area path
  const firstX = padding;
  const lastX = innerW + padding;
  const lastY = height - padding;
  const pathD = `M ${firstX} ${lastY} L ${points} L ${lastX} ${lastY} Z`;

  const ticks = [0, 0.25, 0.5, 0.75, 1];

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <span className="text-xs text-gray-400">Jan - Dec</span>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
        {/* grid */}
        {ticks.map((t, idx) => (
          <line key={idx} x1={padding} x2={width - padding} y1={height - padding - t * innerH} y2={height - padding - t * innerH} stroke="#E5E7EB" strokeWidth={1} />
        ))}
        {/* area */}
        <defs>
          <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#0056FF" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#0056FF" stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <path d={pathD} fill="url(#areaGradient)" />
        {/* stroke line */}
        <polyline points={points} fill="none" stroke="#0056FF" strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" />
        {/* axis */}
        <line x1={padding} x2={width - padding} y1={height - padding} y2={height - padding} stroke="#E5E7EB" />
        {/* month labels */}
        {(labels || ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]).map((m, i) => (
          <text key={m} x={padding + (i / 11) * innerW} y={height - padding + 16} fontSize="10" fill="#6B7280">{m}</text>
        ))}
      </svg>
    </div>
  );
}
