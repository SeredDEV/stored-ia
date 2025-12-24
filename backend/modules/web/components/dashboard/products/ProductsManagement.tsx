"use client";
import React from "react";

const ProductsManagement: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
            Gestión de Productos
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Administra el catálogo de productos de tu tienda.
          </p>
        </div>
        <button className="bg-echo-blue dark:bg-primary hover:bg-echo-blue-variant dark:hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all active:scale-95 font-medium">
          <span className="material-symbols-outlined text-sm">add</span>
          Nuevo Producto
        </button>
      </div>

      <div className="bg-white dark:bg-surface-dark p-8 rounded-2xl border border-gray-200 dark:border-gray-700">
        <p className="text-gray-500 dark:text-gray-400">
          Contenido de gestión de productos - Próximamente
        </p>
      </div>
    </div>
  );
};

export default ProductsManagement;
