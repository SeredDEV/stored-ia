
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
import DraftsManagement from './products/drafts/DraftsManagement';
import ProductsManagement from './products/ProductsManagement';
import CategoriesManagement from './products/categories/CategoriesManagement';
import TagsManagement from './products/tags/TagsManagement';
import CollectionsManagement from './products/collections/CollectionsManagement';
import TypesManagement from './products/types/TypesManagement';
import InventoryManagement from './inventory/InventoryManagement';
import ClientsManagement from './clients/ClientsManagement';
import PromotionsManagement from './promotions/PromotionsManagement';
import PriceListsManagement from './price-lists/PriceListsManagement';

const NAV_ITEMS: NavItem[] = [
  { label: 'Pedidos', icon: 'shopping_cart', path: '/orders' },
  { 
    label: 'Productos', 
    icon: 'sell', 
    path: '/products',
    subItems: [
      { label: 'Borradores', icon: 'edit_note', path: '/drafts' },
      { label: 'Categorías', icon: 'category', path: '/categories' },
      { label: 'Etiquetas', icon: 'label', path: '/tags' },
      { label: 'Colecciones', icon: 'collections_bookmark', path: '/collections' },
      { label: 'Tipos', icon: 'style', path: '/types' }
    ]
  },
  { label: 'Inventario', icon: 'warehouse', path: '/inventory' },
  { label: 'Clientes', icon: 'people', path: '/clients' },
  { label: 'Promociones', icon: 'local_offer', path: '/promotions' },
  { label: 'Listas de Precios', icon: 'attach_money', path: '/price-lists' },
];

interface DashboardProps {
  user?: User | null;
  onLogout?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  user = { name: 'Admin User', role: 'Administrator' },
  onLogout
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialView = searchParams.get('view');
  
  // Mapear la vista inicial al path correspondiente
  const [activePath, setActivePath] = useState(() => {
    if (!initialView) return '/orders';
    const path = `/${initialView}`;
    const isValid = NAV_ITEMS.some(item => 
      item.path === path || item.subItems?.some(sub => sub.path === path)
    );
    return isValid ? path : '/orders';
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<string | null>(null);

  // Sincronizar URL cuando cambia activePath
  const handleNavigate = (path: string) => {
    setActivePath(path);
    setMobileMenuOpen(null); // Cerrar menú móvil al navegar
    const view = path.substring(1); // Remover el '/' inicial
    router.push(`/dashboard?view=${view}`);
  };

  const toggleMobileMenu = (path: string) => {
    if (mobileMenuOpen === path) {
      setMobileMenuOpen(null);
    } else {
      setMobileMenuOpen(path);
    }
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
      case '/categories':
        return 'Categorías';
      case '/tags':
        return 'Etiquetas';
      case '/collections':
        return 'Colecciones';
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
      case '/categories':
        return <CategoriesManagement />;
      case '/tags':
        return <TagsManagement />;
      case '/collections':
        return <CollectionsManagement />;
      case '/types':
        return <TypesManagement />;
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
          isSidebarOpen={isSidebarOpen}
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
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-surface-dark border-t border-gray-200 dark:border-gray-700 flex justify-around py-2 z-20">
          {navItems.slice(0, 5).map((item) => {
             const hasSubItems = item.subItems && item.subItems.length > 0;
             const isActive = activePath === item.path || item.subItems?.some(sub => sub.path === activePath);

             return (
              <div key={item.path} className="relative flex flex-col items-center">
                {/* Menú flotante para sub-items */}
                {hasSubItems && mobileMenuOpen === item.path && (
                  <>
                    <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-white dark:bg-surface-dark rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 min-w-[160px] overflow-hidden z-30 transform transition-all duration-200 origin-bottom scale-100 opacity-100">
                      <div className="flex flex-col py-1">
                        {/* Opción principal */}
                        <button
                           onClick={() => handleNavigate(item.path)}
                           className={`px-4 py-3 text-left text-sm flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 ${
                             activePath === item.path ? 'bg-echo-blue/5 text-echo-blue dark:text-primary font-medium' : 'text-gray-700 dark:text-gray-300'
                           }`}
                        >
                           <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                           <span>Todos</span>
                        </button>
                        
                        {/* Sub-items */}
                        {item.subItems!.map((subItem) => (
                          <button
                            key={subItem.path}
                            onClick={() => handleNavigate(subItem.path)}
                            className={`px-4 py-3 text-left text-sm flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                              activePath === subItem.path ? 'text-echo-blue dark:text-primary font-medium' : 'text-gray-600 dark:text-gray-400'
                            }`}
                          >
                            <span className="material-symbols-outlined text-[18px]">{subItem.icon}</span>
                            <span>{subItem.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    {/* Flecha del bocadillo */}
                    <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-surface-dark border-r border-b border-gray-200 dark:border-gray-700 transform rotate-45 z-30"></div>
                  </>
                )}
                
                {/* Botón principal de navegación */}
                <button
                  onClick={() => hasSubItems ? toggleMobileMenu(item.path) : handleNavigate(item.path)}
                  className={`flex flex-col items-center p-2 min-w-[60px] ${
                    isActive
                      ? 'text-echo-blue dark:text-primary'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {item.icon && <span className="material-symbols-outlined">{item.icon}</span>}
                  <span className={`text-[10px] mt-1 ${isActive ? 'font-medium' : ''}`}>
                    {item.label}
                  </span>
                </button>
              </div>
            );
          })}
        </nav>
        
        {/* Overlay para cerrar menú móvil al hacer click fuera */}
        {mobileMenuOpen && (
          <div 
            className="fixed inset-0 z-10 bg-black/20 md:hidden"
            onClick={() => setMobileMenuOpen(null)}
          ></div>
        )}

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
