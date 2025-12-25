import React, { useState, useEffect } from "react";
import { Product } from "../types";

interface ProductMobileListProps {
  products: Product[];
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

export const ProductMobileList: React.FC<ProductMobileListProps> = ({
  products,
  onEdit,
  onDelete,
}) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        activeMenuId &&
        !(event.target as Element).closest(".action-menu-container")
      ) {
        setActiveMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeMenuId]);

  return (
    <div className="md:hidden space-y-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">
                  {product.icon}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {product.variants} variantes
                </p>
              </div>
            </div>
            <div className="relative inline-block text-left action-menu-container">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMenuId(
                    activeMenuId === product.id ? null : product.id
                  );
                }}
                className={`transition-colors p-1 rounded-lg ${
                  activeMenuId === product.id
                    ? "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white"
                    : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <span className="material-symbols-outlined">more_vert</span>
              </button>
              {activeMenuId === product.id && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-surface-dark rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right ring-1 ring-black ring-opacity-5">
                  <div className="p-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit?.(product);
                        setActiveMenuId(null);
                      }}
                      className="w-full px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg flex items-center gap-2.5 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[20px] text-gray-500 dark:text-gray-400">
                        edit
                      </span>
                      Editar
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete?.(product);
                        setActiveMenuId(null);
                      }}
                      className="w-full px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg flex items-center gap-2.5 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        delete
                      </span>
                      Eliminar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {product.status}
              </span>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {product.salesChannel}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
