# Backend Modular - Arquitectura tipo Medusa.js

Arquitectura modular inspirada en Medusa.js donde cada módulo es independiente y se comunica mediante APIs y eventos.

## 🏗️ Arquitectura

```
Cliente → Store API → Services → Database
                   ↓
              Plugins/Extensions
                   ↓
          Event Bus → Subscribers
```

## 📁 Estructura

```
backend/
├── modules/
│   ├── web/          # Next.js Dashboard (puerto 3000)
│   ├── api/          # Store API Express (puerto 3001)
│   ├── services/     # Servicios de negocio
│   │   ├── product/
│   │   ├── order/
│   │   ├── inventory/
│   │   └── customer/
│   ├── database/     # Capa de datos
│   ├── events/       # Event Bus y Subscribers
│   └── plugins/      # Plugins y extensiones
│
└── shared/           # Código compartido
    ├── types/
    ├── constants/
    └── utils/
```

## 🚀 Comandos

### Desarrollo
```bash
# Solo el dashboard web
npm run dev:web

# Solo la API
npm run dev:api

# Todo junto
npm run dev:all
```

### Build
```bash
# Build del web
npm run build:web

# Build de la API
npm run build:api

# Build de todo
npm run build:all
```

## 📦 Módulos

### `modules/web`
Dashboard de administración Next.js

### `modules/api`
Store API REST con Express

### `modules/services`
Lógica de negocio (Product, Order, Inventory, Customer)

### `modules/events`
Sistema de eventos pub/sub con subscribers

### `modules/plugins`
Plugins y extensiones (Payment, Shipping, Notification)

### `shared`
Código compartido entre módulos (tipos, constantes, utils)

## 🔄 Flujo de Datos

1. **Cliente** → Petición HTTP a Store API
2. **Store API** → Valida y llama al Service correspondiente
3. **Service** → Ejecuta lógica de negocio y usa Repository
4. **Repository** → Interactúa con Database
5. **Service** → Emite eventos al Event Bus
6. **Subscribers** → Escuchan eventos y ejecutan acciones

## 📝 Notas

- Cada módulo tiene su propio `package.json`
- Los módulos se comunican vía HTTP (API) o eventos (Event Bus)
- El código compartido está en `shared/`
- Fácil agregar nuevos módulos sin afectar los existentes
