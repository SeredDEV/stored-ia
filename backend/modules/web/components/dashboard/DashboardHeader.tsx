'use client';
import React from 'react';

interface DashboardHeaderProps {
  user?: {
    name?: string;
    role?: string;
  } | null;
  isSidebarOpen?: boolean;
  onToggleSidebar?: () => void;
  title?: string; // Título dinámico según la sección
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  user,
  isSidebarOpen = true,
  onToggleSidebar,
  title = 'Panel de Control' // Título por defecto
}) => {
  return (
    <header className="h-16 bg-white dark:bg-surface-dark border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 lg:px-8 flex-shrink-0 transition-colors duration-200">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="md:hidden text-gray-500 dark:text-gray-400"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-100 hidden md:block">
          {title}
        </h1>
        <h1 className="text-lg font-bold text-echo-blue dark:text-primary md:hidden flex items-center gap-2">
          <span className="material-symbols-outlined">bolt</span> ECHO
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full md:hidden">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <div className="text-right hidden md:block">
          <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            {user?.name || 'Admin User'}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {user?.role || 'Administrator'}
          </div>
        </div>
        <div className="w-10 h-10 bg-echo-light-blue dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center font-bold border-2 border-white dark:border-gray-700 shadow-sm">
          {user?.name?.charAt(0) || 'A'}
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;

