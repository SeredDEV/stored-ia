import React from "react";

interface ProductFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  showActions?: boolean;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  searchTerm,
  onSearchChange,
  showActions = true,
}) => {
  return (
    <div className="bg-white dark:bg-surface-dark rounded-t-xl p-4 border border-gray-200 dark:border-gray-700 border-b-0 shadow-sm">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        {showActions && (
          <button className="hidden md:block text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm font-medium px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            Agregar filtro
          </button>
        )}

        <div className="relative flex-1 w-full">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <span className="material-symbols-outlined text-xl">search</span>
          </span>
          <input
            type="text"
            placeholder="Buscar"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-echo-blue dark:focus:ring-primary focus:border-transparent dark:text-gray-200 dark:placeholder-gray-500 transition-shadow"
          />
        </div>

        {showActions && (
          <div className="flex gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm font-medium px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              Exportar
            </button>
            <button className="flex-1 md:flex-none text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm font-medium px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              Importar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
