// Tipos compartidos entre módulos
import React from 'react';

export interface KPIProps {
  label: string;
  value: string;
  subValue?: string;
  trend: 'up' | 'down';
  percentage: string;
  comparisonText: string;
  icon: string;
  colorClass: string;
  iconBgClass: string;
}

export interface ActivityItem {
  id: string;
  title: string;
  description: React.ReactNode;
  time: string;
  icon: string;
  iconColor: string;
  iconBg: string;
}

export interface AlertItem {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  actionText?: string;
  icon: string;
  status?: string;
}

// Tipos de dominio compartidos
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

export interface Customer {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}
