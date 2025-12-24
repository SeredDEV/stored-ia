// Exportaciones centralizadas de los componentes del dashboard
export { default as Dashboard } from './Dashboard';

// Componentes compartidos del layout
export { default as DashboardHeader } from './DashboardHeader';
export { default as SidebarHeader } from './SidebarHeader';
export { default as SidebarSearch } from './SidebarSearch';
export { default as SidebarNavigation } from './SidebarNavigation';
export { default as SidebarFooter } from './SidebarFooter';
export { default as DashboardContent } from './DashboardContent';

// Componentes de gestión por sección
export * from './orders';
export * from './drafts';
export * from './products';
export * from './inventory';
export * from './clients';
export * from './promotions';
export * from './price-lists';

// Componentes compartidos
export * from './shared';


