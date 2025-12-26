import React, { useState, useEffect } from 'react';
import { Collection } from './types';

interface CollectionListProps {
  collections: Collection[];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export const CollectionList: React.FC<CollectionListProps> = ({ collections, onDelete, onEdit }) => {
  const [activeMenu, setActiveMenu] = useState<{
    id: string;
    top: number;
    left: number;
  } | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeMenu && !(event.target as Element).closest(".action-menu-container")) {
        setActiveMenu(null);
      }
    };

    const handleScroll = () => {
      if (activeMenu) {
        setActiveMenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleScroll);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleScroll);
    };
  }, [activeMenu]);

  return (
    <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hidden md:block">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700">
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Manejo</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Productos</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Creado</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {collections.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                    <span className="material-symbols-outlined text-4xl mb-2 opacity-50">collections_bookmark</span>
                    <p className="text-sm">No hay colecciones creadas.</p>
                  </div>
                </td>
              </tr>
            ) : (
              collections.map((collection) => (
                <tr 
                  key={collection.id} 
                  className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-echo-blue/10 dark:bg-primary/10 flex items-center justify-center text-echo-blue dark:text-primary">
                        <span className="material-symbols-outlined text-[18px]">collections_bookmark</span>
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">{collection.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <code className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono text-gray-600 dark:text-gray-300">
                      {collection.slug}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                      <span className="material-symbols-outlined text-[16px]">inventory_2</span>
                      <span className="text-sm">{collection.productsCount}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm" suppressHydrationWarning>
                    {new Date(collection.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right action-menu-container">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (activeMenu?.id === collection.id) {
                          setActiveMenu(null);
                        } else {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setActiveMenu({
                            id: collection.id,
                            top: rect.bottom,
                            left: rect.right - 192, // 192px = w-48
                          });
                        }
                      }}
                      className={`transition-colors p-1.5 rounded-lg ${
                        activeMenu?.id === collection.id
                          ? "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white"
                          : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        more_vert
                      </span>
                    </button>
                    {activeMenu?.id === collection.id && (
                      <div
                        className="fixed w-48 bg-white dark:bg-surface-dark rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 z-[9999] overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-right ring-1 ring-black ring-opacity-5"
                        style={{
                          top: `${activeMenu.top}px`,
                          left: `${activeMenu.left}px`,
                        }}
                      >
                        <div className="p-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(collection.id);
                              setActiveMenu(null);
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
                              setActiveMenu(null);
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
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
