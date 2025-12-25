import React from "react";

interface ProductHeaderProps {
  onOpenNewProduct: () => void;
}

export const ProductHeader: React.FC<ProductHeaderProps> = ({
  onOpenNewProduct,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
          Gestión de Productos
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Administra el catálogo de productos de tu tienda.
        </p>
      </div>
      <button
        onClick={onOpenNewProduct}
        className="bg-echo-blue dark:bg-primary hover:bg-echo-blue-variant dark:hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all active:scale-95 font-medium"
      >
        <span className="material-symbols-outlined text-sm">add</span>
        Nuevo Producto
      </button>
    </div>
  );
};
