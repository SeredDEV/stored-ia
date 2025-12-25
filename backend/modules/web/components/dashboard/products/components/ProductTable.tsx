import React from "react";
import { Product } from "../types";

interface ProductTableProps {
  products: Product[];
  currentPage: number;
  itemsPerPage: number;
  totalProducts: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  currentPage,
  itemsPerPage,
  totalProducts,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-b-xl shadow-sm overflow-hidden hidden md:block">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
              <th className="px-8 py-5 text-left">
                <span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
                  PRODUCTO
                </span>
              </th>
              <th className="px-8 py-5 text-left">
                <span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
                  COLECCIÓN
                </span>
              </th>
              <th className="px-8 py-5 text-left">
                <span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
                  CANALES DE VENTA
                </span>
              </th>
              <th className="px-8 py-5 text-left">
                <span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
                  VARIANTES
                </span>
              </th>
              <th className="px-8 py-5 text-left">
                <span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
                  ESTADO
                </span>
              </th>
              <th className="px-8 py-5 text-right">
                <span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
                  ACCIONES
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {products.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
              >
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-xl text-gray-600 dark:text-gray-300">
                        {product.icon}
                      </span>
                    </div>
                    <div className="font-medium text-base text-gray-900 dark:text-white">
                      {product.name}
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 text-base text-gray-600 dark:text-gray-300">
                  {product.collection}
                </td>
                <td className="px-8 py-6 text-base text-gray-600 dark:text-gray-300">
                  {product.salesChannel}
                </td>
                <td className="px-8 py-6 text-base text-gray-600 dark:text-gray-300">
                  {product.variants} variantes
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                    <span className="text-base text-gray-600 dark:text-gray-300">
                      {product.status}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                    <span className="material-symbols-outlined text-xl">
                      more_vert
                    </span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-8 py-5 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between bg-white dark:bg-surface-dark">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {currentPage === 1 ? 1 : (currentPage - 1) * itemsPerPage + 1}-
          {Math.min(currentPage * itemsPerPage, totalProducts)} de{" "}
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {totalProducts}
          </span>{" "}
          resultados
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {currentPage} de {totalPages} páginas
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Anterior
            </button>
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
