# Estructura Modular - Inspirada en Medusa.js

Esta estructura sigue el patrón de módulos de Medusa.js donde cada módulo es independiente y se puede usar standalone o junto con otros módulos.

## Estructura de Carpetas

```
backend/
├── modules/                    # Módulos independientes (microservicios)
│   ├── web/                   # Módulo Web (Next.js Dashboard)
│   │   ├── app/
│   │   ├── components/
│   │   ├── package.json
│   │   └── ...
│   ├── api/                    # Módulo API (Express)
│   │   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── package.json
│   │   └── ...
│   ├── auth/                   # Módulo de Autenticación
│   ├── inventory/              # Módulo de Inventario
│   └── orders/                 # Módulo de Pedidos
│
├── shared/                     # Código compartido entre módulos
│   ├── types/                  # Tipos TypeScript compartidos
│   ├── constants/              # Constantes compartidas
│   ├── utils/                  # Utilidades compartidas
│   ├── config/                 # Configuraciones compartidas
│   └── package.json
│
├── apps/                       # Aplicaciones (opcional, para monorepo)
│   └── admin/                  # App de administración
│
├── package.json                # Root package.json (workspace)
└── README.md
```

## Principios de Diseño

1. **Módulos Independientes**: Cada módulo puede funcionar standalone
2. **Comunicación entre Módulos**: Los módulos se comunican vía APIs o eventos
3. **Código Compartido**: Tipos, constantes y utilidades en `shared/`
4. **Escalabilidad**: Fácil agregar nuevos módulos sin afectar los existentes








