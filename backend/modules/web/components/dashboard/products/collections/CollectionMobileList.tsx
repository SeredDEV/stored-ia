import React, { useState, useEffect } from 'react';
import { Collection } from './types';

interface CollectionMobileListProps {
  collections: Collection[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export const CollectionMobileList: React.FC<CollectionMobileListProps> = ({
  collections,
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
      {collections.length === 0 ? (
        <div className="bg-white dark:bg-surface-dark p-8 rounded-xl text-center shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
            <span className="material-symbols-outlined text-4xl mb-2 opacity-50">collections_bookmark</span>
            <p className="text-sm">No hay colecciones creadas.</p>
          </div>
        </div>
      ) : (
        collections.map((collection) => (
          <div
            key={collection.id}
            className="bg-white dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-echo-blue/10 dark:bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 border border-echo-blue/5 dark:border-primary/5">
                  <span className="material-symbols-outlined text-2xl text-echo-blue dark:text-primary">
                    collections_bookmark
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white text-base">
                    {collection.title}
                  </h3>
                  <code className="text-xs font-mono text-gray-500 dark:text-gray-400 mt-1 block px-2 py-0.5 bg-gray-50 dark:bg-gray-800 rounded w-fit">
                    {collection.slug}
                  </code>
                </div>
              </div>
              <div className="relative inline-block text-left action-menu-container">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenuId(
                      activeMenuId === collection.id ? null : collection.id
                    );
                  }}
                  className={`transition-colors p-1 rounded-lg ${
                    activeMenuId === collection.id
                      ? "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white"
                      : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <span className="material-symbols-outlined">more_vert</span>
                </button>
                {activeMenuId === collection.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-surface-dark rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right ring-1 ring-black ring-opacity-5">
                    <div className="p-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(collection.id);
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
                          onDelete(collection.id);
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
            <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                <span className="material-symbols-outlined text-[16px]">inventory_2</span>
                <span>{collection.productsCount} productos</span>
              </div>
              <div className="text-xs text-gray-400 dark:text-gray-500" suppressHydrationWarning>
                Creado: {new Date(collection.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
