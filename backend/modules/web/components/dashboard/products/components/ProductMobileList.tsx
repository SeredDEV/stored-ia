import React from "react";
import { Product } from "../types";

interface ProductMobileListProps {
  products: Product[];
}

export const ProductMobileList: React.FC<ProductMobileListProps> = ({
  products,
}) => {
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
            <button className="text-gray-400">
              <span className="material-symbols-outlined">more_vert</span>
            </button>
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
