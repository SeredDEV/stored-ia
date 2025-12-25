
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { User, NavItem } from '../../types';
import DashboardHeader from './DashboardHeader';
import SidebarHeader from './SidebarHeader';
import SidebarSearch from './SidebarSearch';
import SidebarNavigation from './SidebarNavigation';
import SidebarFooter from './SidebarFooter';
import DashboardContent from './DashboardContent';
// Importaciones de componentes de gestión
import OrdersManagement from './orders/OrdersManagement';
import DraftsManagement from './drafts/DraftsManagement';
import ProductsManagement from './products/ProductsManagement';
import InventoryManagement from './inventory/InventoryManagement';
import ClientsManagement from './clients/ClientsManagement';
import PromotionsManagement from './promotions/PromotionsManagement';
import PriceListsManagement from './price-lists/PriceListsManagement';

interface DashboardProps {
  user?: User | null;
  onLogout?: () => void;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Pedidos', icon: 'shopping_cart', path: '/orders' },
  { label: 'Borradores', icon: 'drafts', path: '/drafts' },
  { label: 'Productos', icon: 'sell', path: '/products' },
  { label: 'Inventario', icon: 'warehouse', path: '/inventory' },
  { label: 'Clientes', icon: 'people', path: '/clients' },
  { label: 'Promociones', icon: 'local_offer', path: '/promotions' },
  { label: 'Listas de Precios', icon: 'attach_money', path: '/price-lists' },
];

const Dashboard: React.FC<DashboardProps> = ({
  user = { name: 'Admin User', role: 'Administrator' },
  onLogout
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialView = searchParams.get('view');
  
  // Mapear la vista inicial al path correspondiente
  const getInitialPath = () => {
    if (!initialView) return '/orders';
    const validPaths = NAV_ITEMS.map(item => item.path);
    const path = `/${initialView}`;
    return validPaths.includes(path) ? path : '/orders';
  };

  const [activePath, setActivePath] = useState(getInitialPath);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Sincronizar URL cuando cambia activePath
  const handleNavigate = (path: string) => {
    setActivePath(path);
    const view = path.substring(1); // Remover el '/' inicial
    router.push(`/dashboard?view=${view}`);
  };

  // Escuchar cambios en la URL (por si el usuario usa botones de atrás/adelante)
  useEffect(() => {
    const view = searchParams.get('view');
    if (view) {
      const path = `/${view}`;
      if (path !== activePath) {
        setActivePath(path);
      }
    }
  }, [searchParams]);

  const navItems = NAV_ITEMS;

  // Función para obtener el título según la ruta activa
  const getHeaderTitle = (): string => {
    switch (activePath) {
      case '/orders':
        return 'Pedidos';
      case '/drafts':
        return 'Borradores';
      case '/products':
        return 'Productos';
      case '/inventory':
        return 'Inventario';
      case '/clients':
        return 'Clientes';
      case '/promotions':
        return 'Promociones';
      case '/price-lists':
        return 'Listas de Precios';
      default:
        return 'Pedidos';
    }
  };

  const renderContent = () => {
    switch (activePath) {
      case '/orders':
        return <OrdersManagement />;
      case '/drafts':
        return <DraftsManagement />;
      case '/products':
        return <ProductsManagement />;
      case '/inventory':
        return <InventoryManagement />;
      case '/clients':
        return <ClientsManagement />;
      case '/promotions':
        return <PromotionsManagement />;
      case '/price-lists':
        return <PriceListsManagement />;
      default:
        return <OrdersManagement />;
    }
  };

  return (
    <div className="min-h-screen bg-echo-beige dark:bg-background-dark text-gray-800 dark:text-gray-200 transition-colors duration-200 flex overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${isSidebarOpen ? 'w-20 lg:w-64' : 'w-20'
          } bg-white dark:bg-surface-dark border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col z-20 flex-shrink-0 hidden md:flex`}
      >
        <SidebarHeader isSidebarOpen={isSidebarOpen} />
        
        <SidebarSearch />
        
        <SidebarNavigation
          navItems={navItems}
          activePath={activePath}
          onNavigate={handleNavigate}
        />

        <SidebarFooter
          user={user}
          isSidebarOpen={isSidebarOpen}
          onLogout={onLogout}
        />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <DashboardHeader
          user={user}
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          title={getHeaderTitle()}
        />

        <DashboardContent>
          {renderContent()}
        </DashboardContent>

        {/* Mobile Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-surface-dark border-t border-gray-200 dark:border-gray-700 flex justify-around py-2 z-20 overflow-x-auto">
          {navItems.slice(0, 5).map((item) => (
            <button
              key={item.path}
              onClick={() => handleNavigate(item.path)}
              className={`flex flex-col items-center p-2 min-w-[60px] ${
                activePath === item.path
                  ? 'text-echo-blue dark:text-primary'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {item.icon && <span className="material-symbols-outlined">{item.icon}</span>}
              <span className={`text-[10px] mt-1 ${activePath === item.path ? 'font-medium' : ''}`}>
                {item.label}
              </span>
            </button>
          ))}
        </nav>
        <div className="h-16 md:hidden"></div>
      </main>

      {/* Background Pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05] z-0"
        style={{
          backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      ></div>
    </div>
  );
};


export default Dashboard;
