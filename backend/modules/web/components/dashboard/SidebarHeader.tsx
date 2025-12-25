'use client';
import React from 'react';

interface SidebarHeaderProps {
  isSidebarOpen?: boolean;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  isSidebarOpen = true
}) => {
  return (
    <div className="h-16 flex items-center justify-center lg:justify-start px-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 text-echo-blue dark:text-primary font-bold text-lg">
        <span className="bg-echo-blue dark:bg-primary text-white p-1.5 rounded-lg flex items-center justify-center">
          <span className="material-symbols-outlined text-[18px]">bolt</span>
        </span>
        {isSidebarOpen && <span className="hidden lg:block">ECHO</span>}
      </div>
    </div>
  );
};

export default SidebarHeader;

