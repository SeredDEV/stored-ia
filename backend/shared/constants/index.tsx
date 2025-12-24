import React from 'react';
import { KPIProps, ActivityItem, AlertItem } from '../types';

export const DASHBOARD_KPIS: KPIProps[] = [
  {
    label: 'Ingresos Totales',
    value: '$12,450',
    trend: 'up',
    percentage: '+12%',
    comparisonText: 'vs mes anterior',
    icon: 'payments',
    colorClass: 'text-green-600',
    iconBgClass: 'bg-green-100 dark:bg-green-900/30'
  },
  {
    label: 'Pedidos Activos',
    value: '45',
    trend: 'up',
    percentage: '+5%',
    comparisonText: 'vs semana anterior',
    icon: 'local_shipping',
    colorClass: 'text-primary',
    iconBgClass: 'bg-blue-100 dark:bg-blue-900/30'
  },
  {
    label: 'Satisfacción (CSAT)',
    value: '4.8',
    subValue: '/5.0',
    trend: 'up',
    percentage: '+0.2%',
    comparisonText: 'promedio',
    icon: 'star',
    colorClass: 'text-yellow-600',
    iconBgClass: 'bg-yellow-100 dark:bg-yellow-900/30'
  },
  {
    label: 'Nivel de Stock',
    value: '98%',
    trend: 'down',
    percentage: '-2%',
    comparisonText: 'rotación alta',
    icon: 'inventory',
    colorClass: 'text-purple-600',
    iconBgClass: 'bg-purple-100 dark:bg-purple-900/30'
  }
];

export const SALES_DATA = [
  { name: 'Semana 1', current: 200, previous: 220 },
  { name: 'Semana 2', current: 150, previous: 200 },
  { name: 'Semana 3', current: 280, previous: 180 },
  { name: 'Semana 4', current: 300, previous: 100 },
];

export const RECENT_ACTIVITY: ActivityItem[] = [
  {
    id: '1',
    title: 'Nuevo pedido #9921',
    description: <span>Juan P. compró <strong className="font-medium text-gray-700 dark:text-gray-300">Kit Inicio Philips Hue</strong></span>,
    time: 'Hace 2 min',
    icon: 'shopping_bag',
    iconColor: 'text-primary',
    iconBg: 'bg-blue-50 dark:bg-blue-900/20'
  },
  {
    id: '2',
    title: 'Solicitud de Devolución',
    description: 'Motivo: "Producto defectuoso" - Smart Lock Pro',
    time: 'Hace 15 min',
    icon: 'keyboard_return',
    iconColor: 'text-orange-500',
    iconBg: 'bg-orange-50 dark:bg-orange-900/20'
  },
  {
    id: '3',
    title: 'Nuevo Cliente Registrado',
    description: 'María Gonzalez se unió desde la campaña de Instagram',
    time: 'Hace 1 hora',
    icon: 'person_add',
    iconColor: 'text-green-600',
    iconBg: 'bg-green-50 dark:bg-green-900/20'
  },
  {
    id: '4',
    title: 'Actualización de Inventario',
    description: 'Stock reabastecido para: Google Nest Mini (50 unidades)',
    time: 'Hace 3 horas',
    icon: 'update',
    iconColor: 'text-purple-600',
    iconBg: 'bg-purple-50 dark:bg-purple-900/20'
  }
];

export const CRITICAL_ALERTS: AlertItem[] = [
  {
    id: 'a1',
    type: 'critical',
    title: 'Stock Crítico',
    description: 'Zigbee Hub - Solo quedan 3 unidades. Reordenar urgente.',
    actionText: 'Gestionar Inventario',
    icon: 'inventory'
  },
  {
    id: 'a2',
    type: 'warning',
    title: 'Envío Retrasado',
    description: 'Pedido #9901 lleva 48h sin movimiento en logística.',
    actionText: 'Ver Detalles',
    icon: 'local_shipping'
  },
  {
    id: 'a3',
    type: 'info',
    title: 'Mantenimiento Servidor',
    description: 'Programado para Hoy, 02:00 AM',
    status: 'Resuelto',
    icon: 'dns'
  }
];








