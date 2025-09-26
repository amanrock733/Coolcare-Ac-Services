"use client";
import React from "react";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  Icon: LucideIcon;
  subtitle?: string;
  color?: "primary" | "green" | "yellow" | "red" | "gray";
  blinking?: boolean;
}

const colorMap = {
  primary: "text-primary bg-primary/10",
  green: "text-green-600 bg-green-100",
  yellow: "text-yellow-600 bg-yellow-100",
  red: "text-red-600 bg-red-100",
  gray: "text-gray-600 bg-gray-100",
};

export default function StatsCard({ title, value, Icon, subtitle, color = "gray", blinking }: StatsCardProps) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-4">
        <div className={`w-11 h-11 rounded-3xl flex items-center justify-center ${colorMap[color]}`}>
          <Icon className={`h-5 w-5 ${blinking ? 'blink' : ''}`} />
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}
