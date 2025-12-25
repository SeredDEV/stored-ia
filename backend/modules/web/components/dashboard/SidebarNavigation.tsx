'use client';
import React, { useState, useEffect } from 'react';
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
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Expand parent if a subitem is active
  useEffect(() => {
    const newExpandedItems = navItems
      .filter(item => item.path === activePath || item.subItems?.some(sub => sub.path === activePath))
      .map(item => item.path);
    setExpandedItems(newExpandedItems);
  }, [activePath, navItems]);

  const toggleExpand = (path: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedItems(prev =>
      prev.includes(path) ? prev.filter(p => p !== path) : [...prev, path]
    );
  };

  const renderNavItem = (item: NavItem, level = 0) => {
    const isActive = activePath === item.path;
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isExpanded = expandedItems.includes(item.path);
    // Responsive padding: no padding on mobile/tablet (centered), indented on desktop
    const paddingClass = level === 0 
      ? 'justify-center lg:justify-start px-0 lg:px-3' 
      : 'justify-center lg:justify-start px-0 lg:pl-10 lg:pr-3';

    return (
      <div key={item.path}>
        <button
          onClick={(e) => {
            onNavigate(item.path);
            if (hasSubItems && level === 0) {
              setExpandedItems(prev =>
                prev.includes(item.path) ? prev : [...prev, item.path]
              );
            }
          }}
          className={`w-full flex items-center ${paddingClass} gap-3 py-2.5 rounded-lg transition-all ${
            isActive && !hasSubItems
              ? 'bg-echo-blue dark:bg-primary text-white shadow-sm'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
          title={item.label}
        >
          <div className="flex items-center gap-3">
            {item.icon && (
              <span className="material-symbols-outlined text-[20px]">
                {item.icon}
              </span>
            )}
            <span className="text-sm font-medium hidden lg:block">{item.label}</span>
          </div>
        </button>
        {hasSubItems && isExpanded && (
          <div className="mt-1 space-y-0.5">
            {item.subItems!.map(subItem => renderNavItem(subItem, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
      {navItems.map(item => renderNavItem(item))}
    </nav>
  );
};

export default SidebarNavigation;

