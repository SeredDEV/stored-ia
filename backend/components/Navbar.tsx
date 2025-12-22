
import React from 'react';

interface NavbarProps {
  onMenuClick: () => void;
  onThemeToggle: () => void;
  isDarkMode: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuClick, onThemeToggle, isDarkMode }) => {
  return (
    <header className="h-16 flex items-center justify-between px-6 bg-surface-light dark:bg-surface-dark border-b border-[#e7edf3] dark:border-gray-800 flex-shrink-0 z-10">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-gray-500 hover:text-gray-700" onClick={onMenuClick}>
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div className="hidden md:flex flex-col">
          <h2 className="text-[#0d141b] dark:text-white text-lg font-bold leading-tight">Dashboard</h2>
          <span className="text-xs text-gray-500">Vista general</span>
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center bg-[#f0f4f8] dark:bg-gray-800 rounded-lg px-3 py-2 w-64 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <span className="material-symbols-outlined text-gray-400 text-[20px]">search</span>
          <input 
            className="bg-transparent border-none text-sm w-full focus:ring-0 text-[#0d141b] dark:text-white placeholder-gray-400" 
            placeholder="Buscar pedidos, productos..." 
            type="text"
          />
        </div>
        
        <div className="flex items-center gap-2 md:gap-3">
          <button 
            className="p-2 text-gray-500 hover:text-primary hover:bg-primary/5 rounded-full transition-colors"
            onClick={onThemeToggle}
          >
            <span className="material-symbols-outlined">
              {isDarkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
          
          <button className="relative p-2 text-gray-500 hover:text-primary hover:bg-primary/5 rounded-full transition-colors">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2.5 right-2.5 size-2 bg-red-500 rounded-full border-2 border-white dark:border-[#1A2633]"></span>
          </button>
          
          <button className="p-2 text-gray-500 hover:text-primary hover:bg-primary/5 rounded-full transition-colors">
            <span className="material-symbols-outlined">help</span>
          </button>
        </div>
      </div>
    </header>
  );
};
