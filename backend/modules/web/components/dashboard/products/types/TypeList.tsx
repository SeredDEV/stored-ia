import React, { useState, useEffect } from 'react';
import { ProductType } from './types';

interface TypeListProps {
  types: ProductType[];
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

export const TypeList: React.FC<TypeListProps> = ({ types, onDelete, onEdit }) => {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hidden md:block">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Valor</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Creado en</th>
              <th className="px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actualizado en</th>
              <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {types.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                    <span className="material-symbols-outlined text-4xl mb-2 opacity-50">style</span>
                    <p className="text-sm">No hay tipos de producto creados.</p>
                  </div>
                </td>
              </tr>
            ) : (
              types.map((type) => (
                <tr 
                  key={type.id} 
                  className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200"
                >
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900 dark:text-white">{type.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(type.createdAt)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(type.updatedAt)}</span>
                  </td>
                  <td className="px-6 py-4 text-right action-menu-container">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (activeMenu?.id === type.id) {
                          setActiveMenu(null);
                        } else {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setActiveMenu({
                            id: type.id,
                            top: rect.bottom,
                            left: rect.right - 192, // 192px = w-48
                          });
                        }
                      }}
                      className={`transition-colors p-1.5 rounded-lg ${
                        activeMenu?.id === type.id
                          ? "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white"
                          : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        more_vert
                      </span>
                    </button>
                    {activeMenu?.id === type.id && (
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
                              onEdit(type.id);
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
                              onDelete(type.id);
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
