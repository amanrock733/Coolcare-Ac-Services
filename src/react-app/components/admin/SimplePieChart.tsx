"use client";
import React from "react";

interface PieDatum {
  label: string;
  value: number;
  color: string;
}

interface SimplePieChartProps {
  title?: string;
  data: PieDatum[];
  totalLabel?: string;
}

export default function SimplePieChart({ title = "Service Types", data, totalLabel = "Total" }: SimplePieChartProps) {
  const total = Math.max(1, data.reduce((a, b) => a + b.value, 0));
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="flex items-center gap-6">
        <svg width="160" height="160" viewBox="0 0 160 160">
          <g transform="translate(80,80)">
            {data.map((d, idx) => {
              const pct = d.value / total;
              const dash = pct * circumference;
              const circle = (
                <circle
                  key={idx}
                  r={radius}
                  cx={0}
                  cy={0}
                  fill="transparent"
                  stroke={d.color}
                  strokeWidth={14}
                  strokeDasharray={`${dash} ${circumference - dash}`}
                  strokeDashoffset={-offset}
                  strokeLinecap="round"
                />
              );
              offset += dash;
              return circle;
            })}
            <circle r={36} cx={0} cy={0} fill="#fff" />
            <text x={0} y={-4} textAnchor="middle" fontSize="18" fontWeight={700} fill="#111827">{total}</text>
            <text x={0} y={16} textAnchor="middle" fontSize="10" fill="#6B7280">{totalLabel}</text>
          </g>
        </svg>
        <ul className="space-y-2">
          {data.map((d) => (
            <li key={d.label} className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: d.color }} />
              <span className="text-sm text-gray-700 w-28">{d.label}</span>
              <span className="text-sm font-medium text-gray-900">{d.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
