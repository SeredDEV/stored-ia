'use client';

import React from 'react';
import Link from 'next/link';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden" 
          onClick={onClose}
        />
      )}
      
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-surface-light dark:bg-surface-dark border-r border-[#e7edf3] dark:border-gray-800 flex-shrink-0 flex flex-col transition-transform duration-300 md:translate-x-0 md:static
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex items-center gap-3">
          <div className="bg-primary/10 rounded-full p-2">
            <span className="material-symbols-outlined text-primary text-2xl">home_iot_device</span>
          </div>
          <h1 className="text-lg font-bold tracking-tight text-[#0d141b] dark:text-white">Domótica Admin</h1>
        </div>

        <nav className="flex-1 px-4 flex flex-col gap-2 overflow-y-auto">
          <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-primary/10 text-primary" href="/">
            <span className="material-symbols-outlined icon-filled">dashboard</span>
            <span className="text-sm font-semibold">Dashboard</span>
          </Link>
          
          <div className="pt-4 pb-2">
            <p className="px-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Gestión</p>
          </div>
          <NavItem icon="inventory_2" label="Inventario" />
          <NavItem icon="shopping_cart" label="Pedidos" />
          <NavItem icon="group" label="Clientes" />
          
          <div className="pt-4 pb-2">
            <p className="px-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Reportes</p>
          </div>
          <NavItem icon="bar_chart" label="Analítica" />
          <NavItem icon="settings" label="Configuración" />
        </nav>

        <div className="p-4 border-t border-[#e7edf3] dark:border-gray-800">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-8 shadow-sm" style={{backgroundImage: 'url("https://picsum.photos/seed/admin/100/100")'}}></div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#0d141b] dark:text-white truncate">Carlos Admin</p>
              <p className="text-xs text-gray-500 truncate">admin@domotica.store</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

const NavItem: React.FC<{ icon: string; label: string }> = ({ icon, label }) => (
  <Link className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group" href="#">
    <span className="material-symbols-outlined group-hover:text-[#0d141b] dark:group-hover:text-white">{icon}</span>
    <span className="text-sm font-medium">{label}</span>
  </Link>
);


