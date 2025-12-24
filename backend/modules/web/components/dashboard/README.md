# Dashboard Components

Estructura organizada de componentes del dashboard.

## Estructura de Carpetas

```
dashboard/
├── Dashboard.tsx                    # Componente principal del dashboard
├── DashboardHeader.tsx              # Header del área principal (título dinámico)
├── DashboardContent.tsx             # Contenedor del contenido principal
│
├── SidebarHeader.tsx                # Header del sidebar (logo ECHO)
├── SidebarSearch.tsx                # Barra de búsqueda del sidebar
├── SidebarNavigation.tsx            # Navegación del sidebar
├── SidebarFooter.tsx                # Footer del sidebar (logout)
│
├── orders/                          # Gestión de Pedidos
│   ├── OrdersManagement.tsx
│   └── index.ts
│
├── drafts/                          # Gestión de Borradores
│   ├── DraftsManagement.tsx
│   └── index.ts
│
├── products/                        # Gestión de Productos
│   ├── ProductsManagement.tsx
│   └── index.ts
│
├── inventory/                       # Control de Inventario
│   ├── InventoryManagement.tsx
│   └── index.ts
│
├── clients/                         # Gestión de Clientes
│   ├── ClientsManagement.tsx
│   ├── UserManagement.tsx          # Gestión de usuarios (legacy)
│   └── index.ts
│
├── promotions/                      # Promociones y Descuentos
│   ├── PromotionsManagement.tsx
│   └── index.ts
│
├── price-lists/                     # Listas de Precios
│   ├── PriceListsManagement.tsx
│   └── index.ts
│
├── shared/                          # Componentes compartidos
│   ├── StatsCard.tsx
│   ├── SalesChart.tsx
│   ├── ActivityFeed.tsx
│   ├── AlertsPanel.tsx
│   ├── Assistant.tsx
│   └── index.ts
│
├── index.ts                         # Exportaciones centralizadas
└── README.md                        # Documentación
```

## Componentes del Layout

### Componentes Estáticos (No cambian)

- **SidebarHeader**: Logo ECHO
- **SidebarNavigation**: Menú de navegación
- **SidebarFooter**: Botón de cerrar sesión

### Componentes Dinámicos

- **DashboardHeader**: Solo cambia el título según la sección activa
- **DashboardContent**: Área de trabajo que cambia completamente según la selección

## Gestión por Secciones

Cada sección tiene su propia carpeta con:

- Componente principal de gestión
- Sub-componentes específicos de esa sección
- Archivo `index.ts` para exportaciones

## Uso

```typescript
// Importar el dashboard completo
import Dashboard from "@/components/dashboard";

// Importar componentes específicos
import { OrdersManagement } from "@/components/dashboard/orders";
import { ProductsManagement } from "@/components/dashboard/products";
```
