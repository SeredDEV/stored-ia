
import React, { useState } from 'react';
import { User, NavItem } from '../../types';
import Assistant from './Assistant';

interface DashboardProps {
  user?: User | null;
  onLogout?: () => void;
}

const NavLink: React.FC<{ item: NavItem; isActive: boolean; onClick: () => void }> = ({ item, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
        ? 'bg-echo-blue text-white shadow-lg shadow-echo-blue/20'
        : 'text-echo-gray hover:bg-echo-blue/10 hover:text-echo-blue'
      }`}
  >
    <span className="material-symbols-outlined">{item.icon}</span>
    <span className="font-medium">{item.label}</span>
  </button>
);

const Dashboard: React.FC<DashboardProps> = ({
  user = { name: 'Admin User', role: 'Administrator' },
  onLogout
}) => {
  const [activePath, setActivePath] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navItems: NavItem[] = [
    { label: 'Resumen', icon: 'dashboard', path: '' },
    { label: 'Usuarios', icon: 'group', path: '/users' },
    { label: 'Analíticas', icon: 'analytics', path: '/analytics' },
    { label: 'Configuración', icon: 'settings', path: '/settings' },
  ];

  const renderContent = () => {
    switch (activePath) {
      case '':
        return <HomeOverview />;
      case '/users':
        return <div className="p-8 bg-white rounded-2xl border border-gray-200">Gestión de Usuarios - Próximamente</div>;
      case '/analytics':
        return <div className="p-8 bg-white rounded-2xl border border-gray-200 text-echo-blue font-bold">Estadísticas Detalladas</div>;
      case '/settings':
        return <div className="p-8 bg-white rounded-2xl border border-gray-200">Ajustes del Sistema</div>;
      default:
        return <HomeOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-echo-beige flex">
      {/* Sidebar */}
      <aside
        className={`${isSidebarOpen ? 'w-64' : 'w-20'
          } bg-white border-r border-gray-200 transition-all duration-300 flex flex-col z-20`}
      >
        <div className="h-20 flex items-center px-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-echo-blue rounded-lg flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-white">bolt</span>
            </div>
            {isSidebarOpen && <span className="font-black text-xl tracking-tighter text-echo-blue">ECHO</span>}
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              item={item}
              isActive={activePath === item.path}
              onClick={() => setActivePath(item.path)}
            />
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={onLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-echo-red hover:bg-echo-red/10 rounded-xl transition-all"
          >
            <span className="material-symbols-outlined">logout</span>
            {isSidebarOpen && <span className="font-medium">Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-gray-200 px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-echo-beige rounded-lg text-echo-gray"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <h2 className="text-xl font-bold text-echo-black">Panel de Control</h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-bold text-echo-black">{user?.name}</span>
              <span className="text-xs text-echo-gray capitalize">{user?.role}</span>
            </div>
            <div className="w-10 h-10 bg-echo-light-blue rounded-full flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0) || 'U'}
            </div>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <div className="flex-1 overflow-y-auto p-8">
          {renderContent()}
        </div>

        {/* Echo Assistant Floating */}
        <Assistant />
      </main>
    </div>
  );
};

const HomeOverview = () => (
  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard title="Ventas Totales" value="$45,231" change="+12.5%" icon="payments" color="echo-blue" />
      <StatCard title="Usuarios Activos" value="2,842" change="+3.2%" icon="person" color="echo-cyan" />
      <StatCard title="Sesiones Hoy" value="1,204" change="-0.8%" icon="schedule" color="echo-pastel" />
      <StatCard title="Alertas" value="3" change="Sin cambios" icon="warning" color="echo-red" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold mb-6 text-echo-black">Rendimiento Mensual</h3>
        <div className="h-64 flex items-end justify-between gap-2">
          {[40, 60, 45, 90, 65, 80, 50, 70, 85, 95, 60, 75].map((h, i) => (
            <div key={i} className="flex-1 bg-echo-blue/20 rounded-t-lg group relative cursor-pointer hover:bg-echo-blue transition-all" style={{ height: `${h}%` }}>
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-echo-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {h}%
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4 text-xs text-echo-gray font-medium uppercase tracking-wider">
          <span>Ene</span><span>Feb</span><span>Mar</span><span>Abr</span><span>May</span><span>Jun</span><span>Jul</span><span>Ago</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dic</span>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold mb-6 text-echo-black">Actividad Reciente</h3>
        <div className="space-y-6">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-echo-blue mt-2"></div>
              <div>
                <p className="text-sm font-semibold text-echo-black">Nuevo usuario registrado</p>
                <p className="text-xs text-echo-gray">Hace {n * 15} minutos</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const StatCard = ({ title, value, change, icon, color }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl bg-${color}/10 text-${color}`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <span className={`text-xs font-bold ${change.startsWith('+') ? 'text-green-500' : change.startsWith('-') ? 'text-red-500' : 'text-gray-400'}`}>
        {change}
      </span>
    </div>
    <h4 className="text-echo-gray text-sm font-medium mb-1">{title}</h4>
    <p className="text-2xl font-black text-echo-black">{value}</p>
  </div>
);

export default Dashboard;
