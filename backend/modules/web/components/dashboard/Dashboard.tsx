import React from "react";
import { StatsCard } from "./StatsCard";
import { SalesChart } from "./SalesChart";
import { ActivityFeed } from "./ActivityFeed";
import { AlertsPanel } from "./AlertsPanel";
import { DASHBOARD_KPIS } from "@domotica/shared/constants";

export const Dashboard: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6">
      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-[#0d141b] dark:text-white">
            Panel de Control
          </h1>
          <p className="text-gray-500 mt-1">
            Resumen de operaciones y métricas clave del día.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-surface-dark border border-[#e7edf3] dark:border-gray-700 rounded-lg text-sm font-semibold text-[#0d141b] dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">
              download
            </span>
            Exportar
          </button>
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg text-sm font-bold hover:bg-blue-600 transition-colors shadow-sm shadow-blue-200 dark:shadow-none"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Nuevo Pedido
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {DASHBOARD_KPIS.map((kpi, idx) => (
          <StatsCard key={idx} {...kpi} />
        ))}
      </div>

      {/* Main Chart Section */}
      <SalesChart />

      {/* Bottom Section: Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ActivityFeed />
        </div>
        <div className="lg:col-span-1">
          <AlertsPanel />
        </div>
      </div>
    </div>
  );
};
