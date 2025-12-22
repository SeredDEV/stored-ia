
// Add React import to support React.ReactNode type
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
  // Correctly type description as React.ReactNode to allow JSX elements
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
