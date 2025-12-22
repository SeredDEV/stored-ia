
import React from 'react';
import { CRITICAL_ALERTS } from '../constants';

export const AlertsPanel: React.FC = () => {
  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-[#e7edf3] dark:border-gray-700 shadow-sm flex flex-col h-full">
      <div className="p-5 border-b border-[#e7edf3] dark:border-gray-700 flex justify-between items-center bg-red-50 dark:bg-red-900/10 rounded-t-xl">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-red-600 text-[20px]">warning</span>
          <h3 className="font-bold text-red-700 dark:text-red-400">Alertas Críticas</h3>
        </div>
        <span className="bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-100 text-xs font-bold px-2 py-0.5 rounded-full">3 Nuevas</span>
      </div>
      
      <div className="p-4 flex flex-col gap-3">
        {CRITICAL_ALERTS.map((alert) => (
          <div 
            key={alert.id} 
            className={`p-3 bg-white dark:bg-gray-800 border rounded-lg shadow-sm flex gap-3 ${
              alert.type === 'critical' ? 'border-red-100 dark:border-red-900/30' : 
              alert.type === 'warning' ? 'border-yellow-100 dark:border-yellow-900/30' : 
              'border-gray-100 dark:border-gray-700 opacity-75'
            }`}
          >
            <span className={`material-symbols-outlined text-[20px] mt-0.5 ${
              alert.type === 'critical' ? 'text-red-500' : 
              alert.type === 'warning' ? 'text-yellow-600' : 
              'text-gray-500'
            }`}>
              {alert.icon}
            </span>
            <div>
              <p className="text-sm font-bold text-[#0d141b] dark:text-white">{alert.title}</p>
              <p className="text-xs text-gray-500 mt-1">
                {alert.description}
                {alert.status && <span className="ml-1 text-gray-400">({alert.status})</span>}
              </p>
              {alert.actionText && (
                <button className="mt-2 text-xs font-semibold text-primary hover:underline">
                  {alert.actionText}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
