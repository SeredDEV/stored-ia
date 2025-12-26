import { NavItem } from '../../types';

export const NAV_ITEMS: NavItem[] = [
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
