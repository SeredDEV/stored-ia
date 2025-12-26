import React, { useState, useEffect } from 'react';
import { ProductType } from './types';

interface TypeMobileListProps {
  types: ProductType[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TypeMobileList: React.FC<TypeMobileListProps> = ({
  types,
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="md:hidden space-y-4">
      {types.length === 0 ? (
        <div className="bg-white dark:bg-surface-dark p-8 rounded-xl text-center shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
            <span className="material-symbols-outlined text-4xl mb-2 opacity-50">style</span>
            <p className="text-sm">No hay tipos de producto creados.</p>
          </div>
        </div>
      ) : (
        types.map((type) => (
          <div
            key={type.id}
            className="bg-white dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-xl text-gray-500 dark:text-gray-400">
                    style
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-base">
                    {type.name}
                  </h3>
                </div>
              </div>
              <div className="relative inline-block text-left action-menu-container">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenuId(
                      activeMenuId === type.id ? null : type.id
                    );
                  }}
                  className={`transition-colors p-1 rounded-lg ${
                    activeMenuId === type.id
                      ? "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white"
                      : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <span className="material-symbols-outlined">more_vert</span>
                </button>
                {activeMenuId === type.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-surface-dark rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right ring-1 ring-black ring-opacity-5">
                    <div className="p-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(type.id);
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
                          onDelete(type.id);
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
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-100 dark:border-gray-700">
              <div className="flex flex-col">
                <span className="uppercase tracking-wider text-[10px] mb-0.5">Creado</span>
                <span>{formatDate(type.createdAt)}</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="uppercase tracking-wider text-[10px] mb-0.5">Actualizado</span>
                <span>{formatDate(type.updatedAt)}</span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
