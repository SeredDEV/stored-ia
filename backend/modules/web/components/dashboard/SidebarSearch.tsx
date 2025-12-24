'use client';
import React from 'react';

interface SidebarSearchProps {
  onSearch?: (query: string) => void;
}

const SidebarSearch: React.FC<SidebarSearchProps> = ({ onSearch }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Detectar ⌘K (Mac) o Ctrl+K (Windows/Linux)
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      const input = e.currentTarget;
      input.focus();
      input.select();
    }
  };

  return (
    <div className="px-3 pt-3 pb-2 hidden lg:block">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          <span className="material-symbols-outlined text-[20px]">search</span>
        </span>
        <input
          type="text"
          placeholder="Buscar..."
          onKeyDown={handleKeyDown}
          onChange={(e) => onSearch?.(e.target.value)}
          className="w-full pl-10 pr-16 py-2 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 focus:ring-2 focus:ring-echo-blue dark:focus:ring-primary focus:border-transparent transition-all"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-mono pointer-events-none">
          ⌘K
        </span>
      </div>
    </div>
  );
};

export default SidebarSearch;

