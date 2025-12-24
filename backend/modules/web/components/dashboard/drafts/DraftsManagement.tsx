"use client";
import React from "react";

const DraftsManagement: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
            Borradores
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Gestiona tus borradores y trabajos en progreso.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-surface-dark p-8 rounded-2xl border border-gray-200 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400">
          Contenido de borradores - Próximamente
        </p>
      </div>
    </div>
  );
};

export default DraftsManagement;
