import React from 'react';
import { KPIProps } from '@domotica/shared/types';

export const StatsCard: React.FC<KPIProps> = ({ 
  label, 
  value, 
  subValue, 
  trend, 
  percentage, 
  comparisonText, 
  icon, 
  colorClass, 
  iconBgClass 
}) => {
  return (
    <div className="bg-surface-light dark:bg-surface-dark p-5 rounded-xl border border-[#e7edf3] dark:border-gray-700 shadow-sm flex flex-col justify-between h-32">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <h3 className="text-2xl font-bold text-[#0d141b] dark:text-white mt-1">
            {value}
            {subValue && <span className="text-lg text-gray-400 font-normal">{subValue}</span>}
          </h3>
        </div>
        <div className={`${iconBgClass} p-1.5 rounded-lg`}>
          <span className={`material-symbols-outlined ${colorClass}`}>{icon}</span>
        </div>
      </div>
      <div className="flex items-center gap-1 mt-auto">
        <span className={`material-symbols-outlined text-sm ${trend === 'up' ? 'text-[#078838]' : 'text-[#e73908]'}`}>
          {trend === 'up' ? 'trending_up' : 'trending_down'}
        </span>
        <span className={`text-sm font-semibold ${trend === 'up' ? 'text-[#078838]' : 'text-[#e73908]'}`}>
          {percentage}
        </span>
        <span className="text-gray-400 text-xs ml-1">{comparisonText}</span>
      </div>
    </div>
  );
};


