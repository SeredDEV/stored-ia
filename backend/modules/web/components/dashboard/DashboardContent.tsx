'use client';
import React from 'react';

interface DashboardContentProps {
  children: React.ReactNode;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ children }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-echo-beige dark:bg-background-dark">
      {children}
    </div>
  );
};

export default DashboardContent;

