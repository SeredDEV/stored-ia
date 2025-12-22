# Arquitectura Modular - Patrón Medusa.js

## Flujo de Arquitectura

```
Cliente → Store API → Services → Database
                   ↓
              Plugins/Extensions
                   ↓
          Event Bus → Subscribers
```

## Estructura de Carpetas

```
backend/
├── modules/                          # Módulos independientes
│   ├── web/                         # Módulo Web (Next.js Dashboard)
│   │   ├── app/                     # Next.js App Router
│   │   ├── components/              # Componentes React
│   │   └── package.json
│   │
│   ├── api/                         # Store API (Express)
│   │   ├── src/
│   │   │   ├── routes/              # Rutas de la API
│   │   │   │   ├── index.ts
│   │   │   │   ├── products.ts
│   │   │   │   ├── orders.ts
│   │   │   │   └── customers.ts
│   │   │   ├── middleware/         # Middleware de Express
│   │   │   └── index.ts            # Inicialización del servidor
│   │   └── package.json
│   │
│   ├── services/                    # Capa de Servicios (Lógica de Negocio)
│   │   ├── product/                # Servicio de Productos
│   │   │   ├── src/
│   │   │   │   ├── product.service.ts
│   │   │   │   └── index.ts
│   │   │   └── package.json
│   │   ├── order/                   # Servicio de Pedidos
│   │   ├── inventory/                # Servicio de Inventario
│   │   └── customer/                # Servicio de Clientes
│   │
│   ├── database/                    # Capa de Base de Datos
│   │   ├── src/
│   │   │   ├── models/             # Modelos de datos
│   │   │   ├── migrations/          # Migraciones
│   │   │   ├── repositories/       # Repositorios (Data Access Layer)
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── plugins/                     # Plugins y Extensiones
│   │   ├── payment/                 # Plugin de Pagos
│   │   ├── shipping/                # Plugin de Envíos
│   │   └── notification/            # Plugin de Notificaciones
│   │
│   └── events/                       # Sistema de Eventos
│       ├── src/
│       │   ├── event-bus.ts         # Event Bus (Pub/Sub)
│       │   ├── subscribers/          # Subscribers (Manejadores de Eventos)
│       │   │   ├── order.subscriber.ts
│       │   │   ├── inventory.subscriber.ts
│       │   │   └── notification.subscriber.ts
│       │   └── index.ts
│       └── package.json
│
├── shared/                           # Código Compartido
│   ├── types/                        # Tipos TypeScript compartidos
│   ├── constants/                    # Constantes compartidas
│   ├── utils/                        # Utilidades compartidas
│   ├── config/                       # Configuraciones compartidas
│   └── package.json
│
├── package.json                      # Root workspace
└── README.md
```

## Flujo de Datos

1. **Cliente** hace una petición HTTP
2. **Store API** recibe la petición y valida
3. **API** llama al **Service** correspondiente
4. **Service** ejecuta lógica de negocio y usa **Repository**
5. **Repository** interactúa con **Database**
6. **Service** emite eventos al **Event Bus**
7. **Subscribers** escuchan eventos y ejecutan acciones (notificaciones, actualizaciones, etc.)
8. **Plugins** pueden interceptar en cualquier punto del flujo

## Comunicación entre Módulos

- **Síncrona**: API → Services → Database (request/response)
- **Asíncrona**: Event Bus → Subscribers (eventos)
