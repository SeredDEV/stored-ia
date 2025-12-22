import React from 'react';
import Link from 'next/link';
import { RECENT_ACTIVITY } from '@domotica/shared/constants';

export const ActivityFeed: React.FC = () => {
  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-[#e7edf3] dark:border-gray-700 shadow-sm flex flex-col">
      <div className="p-5 border-b border-[#e7edf3] dark:border-gray-700 flex justify-between items-center">
        <h3 className="font-bold text-[#0d141b] dark:text-white">Actividad Reciente</h3>
        <Link className="text-sm text-primary font-semibold hover:underline" href="#">Ver todo</Link>
      </div>
      
      <div className="flex-1">
        <div className="flex flex-col">
          {RECENT_ACTIVITY.map((activity, index) => (
            <div 
              key={activity.id} 
              className={`flex gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${
                index !== RECENT_ACTIVITY.length - 1 ? 'border-b border-[#f0f4f8] dark:border-gray-800' : ''
              }`}
            >
              <div className={`size-10 rounded-full ${activity.iconBg} flex items-center justify-center flex-shrink-0`}>
                <span className={`material-symbols-outlined ${activity.iconColor} text-[20px]`}>
                  {activity.icon}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <p className="text-sm font-semibold text-[#0d141b] dark:text-white">{activity.title}</p>
                  <span className="text-xs text-gray-400">{activity.time}</span>
                </div>
                <div className="text-sm text-gray-500 mt-0.5">
                  {activity.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


