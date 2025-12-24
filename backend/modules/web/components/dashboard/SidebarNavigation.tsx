'use client';
import React from 'react';
import { NavItem } from '../../types';

interface SidebarNavigationProps {
  navItems: NavItem[];
  activePath: string;
  onNavigate: (path: string) => void;
}

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  navItems,
  activePath,
  onNavigate
}) => {
  return (
    <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
      {navItems.map((item) => {
        const isActive = activePath === item.path;
        return (
          <button
            key={item.path}
            onClick={() => onNavigate(item.path)}
            className={`w-full flex items-center justify-center lg:justify-start gap-3 px-3 py-2.5 rounded-lg transition-all ${
              isActive
                ? 'bg-echo-blue dark:bg-primary text-white shadow-sm'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
            title={item.label} // Tooltip para cuando solo se muestre el icono
          >
            {item.icon && (
              <span className="material-symbols-outlined text-[20px]">
                {item.icon}
              </span>
            )}
            <span className="text-sm font-medium hidden lg:block">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default SidebarNavigation;

