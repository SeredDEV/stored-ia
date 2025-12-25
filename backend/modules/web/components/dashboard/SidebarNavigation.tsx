'use client';
import React, { useState, useEffect } from 'react';
import { NavItem } from '../../types';

interface SidebarNavigationProps {
  navItems: NavItem[];
  activePath: string;
  onNavigate: (path: string) => void;
  isSidebarOpen?: boolean;
}

const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  navItems,
  activePath,
  onNavigate,
  isSidebarOpen = true
}) => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [activePopoverItem, setActivePopoverItem] = useState<NavItem | null>(null);
  const [popoverPos, setPopoverPos] = useState<{ top: number; left: number } | null>(null);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  // Detect screen size for responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };
    
    // Initial check
    checkScreenSize();
    
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activePopoverItem && !(event.target as Element).closest('.nav-popover-content') && !(event.target as Element).closest('.nav-popover-trigger')) {
        setActivePopoverItem(null);
        setPopoverPos(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activePopoverItem]);

  // Expand parent if a subitem is active (only for accordion mode)
  useEffect(() => {
    if (isLargeScreen && isSidebarOpen) {
      const newExpandedItems = navItems
        .filter(item => item.path === activePath || item.subItems?.some(sub => sub.path === activePath))
        .map(item => item.path);
      setExpandedItems(newExpandedItems);
    }
  }, [activePath, navItems, isLargeScreen, isSidebarOpen]);

  const toggleExpand = (path: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedItems(prev =>
      prev.includes(path) ? prev.filter(p => p !== path) : [...prev, path]
    );
  };

  const handleItemClick = (item: NavItem, level: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isCollapsedMode = !isSidebarOpen || !isLargeScreen;

    if (hasSubItems && level === 0) {
      if (isCollapsedMode) {
        // Toggle Popover in collapsed mode
        if (activePopoverItem?.path === item.path) {
          setActivePopoverItem(null);
          setPopoverPos(null);
        } else {
          const button = e.currentTarget as HTMLElement;
          const rect = button.getBoundingClientRect();
          // Position to the right of the button with a small offset
          setPopoverPos({ top: rect.top, left: rect.right + 12 });
          setActivePopoverItem(item);
        }
      } else {
        // Toggle Accordion in expanded mode
        onNavigate(item.path);
        setExpandedItems(prev =>
          prev.includes(item.path) ? prev : [...prev, item.path]
        );
      }
    } else {
      onNavigate(item.path);
      setActivePopoverItem(null);
      setPopoverPos(null);
    }
  };

  const renderNavItem = (item: NavItem, level = 0) => {
    const isActive = activePath === item.path || item.subItems?.some(sub => sub.path === activePath);
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isExpanded = expandedItems.includes(item.path);
    const isPopoverOpen = activePopoverItem?.path === item.path;
    
    // Responsive padding: no padding on mobile/tablet (centered), indented on desktop
    const paddingClass = level === 0 
      ? 'justify-center lg:justify-start px-0 lg:px-3' 
      : 'justify-center lg:justify-start px-0 lg:pl-10 lg:pr-3';

    // Check if we are in collapsed mode (Tablet or Desktop Collapsed)
    const isCollapsedMode = !isSidebarOpen || !isLargeScreen;

    return (
      <div key={item.path} className="relative">
        <button
          onClick={(e) => handleItemClick(item, level, e)}
          className={`w-full flex items-center ${paddingClass} gap-3 py-2.5 rounded-lg transition-all nav-popover-trigger ${
            isActive && (!hasSubItems || isCollapsedMode)
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

        {/* Accordion Content (Desktop Expanded Only) */}
        {hasSubItems && isExpanded && !isCollapsedMode && (
          <div className="mt-1 space-y-0.5">
            {item.subItems!.map(subItem => renderNavItem(subItem, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
        {navItems.map(item => renderNavItem(item))}
      </nav>

      {/* Popover Content (Fixed Position) */}
      {activePopoverItem && popoverPos && (
        <div 
          className="fixed z-50 animate-fade-in nav-popover-content"
          style={{ 
            top: popoverPos.top, 
            left: popoverPos.left 
          }}
        >
          <div className="bg-white dark:bg-surface-dark rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 min-w-[180px] overflow-hidden">
            {/* Header with Title */}
            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
               <span className="text-sm font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">{activePopoverItem.icon}</span>
                  {activePopoverItem.label}
               </span>
            </div>
            
            {/* Menu Items */}
            <div className="py-1">
              {/* Option: Todos */}
              <button
                 onClick={(e) => {
                   e.stopPropagation();
                   onNavigate(activePopoverItem.path);
                   setActivePopoverItem(null);
                   setPopoverPos(null);
                 }}
                 className={`w-full px-4 py-2 text-left text-sm flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                   activePath === activePopoverItem.path ? 'text-echo-blue dark:text-primary font-medium' : 'text-gray-600 dark:text-gray-400'
                 }`}
              >
                 <span className="material-symbols-outlined text-[18px]">list</span>
                 <span>Todos</span>
              </button>

              {activePopoverItem.subItems!.map((subItem) => (
                <button
                  key={subItem.path}
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate(subItem.path);
                    setActivePopoverItem(null);
                    setPopoverPos(null);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                    activePath === subItem.path ? 'text-echo-blue dark:text-primary font-medium' : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">{subItem.icon}</span>
                  <span>{subItem.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Arrow (Bocadillo) pointing Left */}
          <div className="absolute top-4 -left-1.5 w-3 h-3 bg-white dark:bg-surface-dark border-l border-b border-gray-200 dark:border-gray-700 transform rotate-45"></div>
        </div>
      )}
    </>
  );
};

export default SidebarNavigation;

