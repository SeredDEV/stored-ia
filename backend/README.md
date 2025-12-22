# Dashboard de Administración - Domótica

Panel de control de administración para sistema de domótica, migrado a Next.js con App Router.

## 🚀 Tecnologías

- **Next.js 15** - Framework React con App Router
- **React 19** - Biblioteca UI
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utilitarios
- **Recharts** - Gráficos y visualizaciones

## 📋 Prerrequisitos

- Node.js 18+ 
- npm o yarn

## 🛠️ Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno (opcional):
Crea un archivo `.env.local` en la raíz del proyecto:
```env
GEMINI_API_KEY=tu_api_key_aqui
```

## 🏃 Ejecutar Localmente

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 📦 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta el linter

## 📁 Estructura del Proyecto

```
backend/
├── app/                           # App Router de Next.js
│   ├── layout.tsx                # Layout raíz
│   ├── page.tsx                  # Página principal
│   └── globals.css               # Estilos globales
├── components/                    # Componentes React organizados
│   ├── dashboard/                # Componentes del panel de control
│   │   ├── Dashboard.tsx         # Componente principal del dashboard
│   │   ├── StatsCard.tsx        # Tarjetas de estadísticas
│   │   ├── SalesChart.tsx       # Gráfico de ventas
│   │   ├── ActivityFeed.tsx     # Feed de actividad
│   │   ├── AlertsPanel.tsx      # Panel de alertas
│   │   └── index.ts             # Exportaciones centralizadas
│   └── layout/                   # Componentes de layout
│       ├── DashboardLayout.tsx  # Layout principal del dashboard
│       ├── Sidebar.tsx          # Barra lateral
│       ├── Navbar.tsx           # Barra de navegación
│       └── index.ts             # Exportaciones centralizadas
├── constants.tsx                 # Constantes y datos mock
├── types.ts                     # Tipos TypeScript
├── next.config.ts               # Configuración de Next.js
├── tailwind.config.ts           # Configuración de Tailwind
└── tsconfig.json                # Configuración de TypeScript
```

## ✨ Características

- ✅ Modo oscuro/claro
- ✅ Diseño responsive
- ✅ Componentes reutilizables
- ✅ TypeScript para type safety
- ✅ Optimización con Next.js
- ✅ Separación de Client/Server Components

## 🎨 Buenas Prácticas Implementadas

1. **App Router**: Uso del nuevo sistema de routing de Next.js 13+
2. **Server/Client Components**: Separación adecuada según necesidad de interactividad
3. **Optimización de Fuentes**: Uso de `next/font` para optimizar Google Fonts
4. **Metadata API**: Configuración SEO con Metadata API
5. **TypeScript**: Tipado estricto en todo el proyecto
6. **Tailwind CSS**: Configuración adecuada con PostCSS
7. **Imports Absolutos**: Uso de alias `@/` para imports más limpios
8. **Organización de Componentes**: Estructura modular con carpetas `dashboard/` y `layout/` para mejor mantenibilidad

## 📝 Notas

- Los componentes que requieren interactividad (hooks, eventos) están marcados con `'use client'`
- Los componentes estáticos se mantienen como Server Components por defecto
- Las fuentes Material Symbols se cargan desde Google Fonts
- Tailwind CSS está configurado con modo oscuro basado en clases
