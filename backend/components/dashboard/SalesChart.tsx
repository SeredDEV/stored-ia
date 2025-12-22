"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { SALES_DATA } from "@/constants";

export const SalesChart: React.FC = () => {
  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-[#e7edf3] dark:border-gray-700 shadow-sm p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-[#0d141b] dark:text-white">
            Tendencias de Ventas
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-2xl font-bold text-[#0d141b] dark:text-white tracking-tight">
              $45,200
            </span>
            <span className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 text-xs font-bold px-2 py-0.5 rounded-full">
              +15% vs mes anterior
            </span>
          </div>
        </div>

        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg self-start sm:self-center">
          <button
            type="button"
            className="px-3 py-1 text-xs font-bold rounded-md bg-white dark:bg-gray-700 text-[#0d141b] dark:text-white shadow-sm transition-all"
          >
            Mensual
          </button>
          <button
            type="button"
            className="px-3 py-1 text-xs font-medium rounded-md text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"
          >
            Semanal
          </button>
          <button
            type="button"
            className="px-3 py-1 text-xs font-medium rounded-md text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"
          >
            Diario
          </button>
        </div>
      </div>

      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={SALES_DATA}>
            <defs>
              <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#137fec" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#137fec" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e2e8f0"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              dy={10}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                backgroundColor: "#fff",
                color: "#333",
              }}
            />
            <Area
              type="monotone"
              dataKey="previous"
              stroke="#cbd5e1"
              strokeWidth={3}
              strokeDasharray="8 8"
              fill="transparent"
            />
            <Area
              type="monotone"
              dataKey="current"
              stroke="#137fec"
              strokeWidth={4}
              fillOpacity={1}
              fill="url(#colorCurrent)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
