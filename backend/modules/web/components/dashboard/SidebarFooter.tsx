'use client';
import React from 'react';

interface SidebarFooterProps {
  user?: {
    name?: string;
  } | null;
  isSidebarOpen?: boolean;
  onLogout?: () => void;
}

const SidebarFooter: React.FC<SidebarFooterProps> = ({
  user,
  isSidebarOpen = true,
  onLogout
}) => {
  return (
    <div className="p-3 border-t border-gray-200 dark:border-gray-700">
      <button
        onClick={onLogout}
        className="flex items-center justify-center lg:justify-start gap-3 px-3 py-2 w-full text-echo-red hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
        title="Cerrar Sesión"
      >
        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
          {user?.name?.charAt(0) || 'N'}
        </div>
        {isSidebarOpen && <span className="font-medium text-sm hidden lg:block">Cerrar Sesión</span>}
      </button>
    </div>
  );
};

export default SidebarFooter;

