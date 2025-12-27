import React, { useState, useEffect, useMemo } from "react";
import { Product } from "../types";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from "@tanstack/react-table";

interface ProductTableProps {
  products: Product[];
  currentPage: number;
  itemsPerPage: number;
  totalProducts: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

const columnHelper = createColumnHelper<Product>();

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  currentPage,
  itemsPerPage,
  totalProducts,
  totalPages,
  onPageChange,
  onEdit,
  onDelete,
}) => {
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

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "PRODUCTO",
        cell: (info) => (
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
              {info.row.original.image ? (
                <img
                  src={info.row.original.image}
                  alt={info.getValue()}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="material-symbols-outlined text-xl text-gray-600 dark:text-gray-300">
                  {info.row.original.icon}
                </span>
              )}
            </div>
            <div className="font-medium text-base text-gray-900 dark:text-white">
              {info.getValue()}
            </div>
          </div>
        ),
      }),
      columnHelper.accessor("collection", {
        header: "COLECCIÓN",
        cell: (info) => (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("salesChannel", {
        header: "CANALES DE VENTA",
        cell: (info) => (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.accessor("variants", {
        header: "VARIANTES",
        cell: (info) => (
          <div className="text-sm text-gray-900 dark:text-white">
            {info.getValue()} variante{info.getValue() !== 1 ? "s" : ""}
          </div>
        ),
      }),
      columnHelper.accessor("status", {
        header: "ESTADO",
        cell: (info) => (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
              info.getValue() === "Publicado"
                ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                : "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                info.getValue() === "Publicado"
                  ? "bg-green-500"
                  : "bg-gray-500"
              }`}
            ></span>
            {info.getValue()}
          </span>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: "ACCIONES",
        cell: (info) => {
          const product = info.row.original;
          return (
            <div className="text-right action-menu-container">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (activeMenu?.id === product.id) {
                    setActiveMenu(null);
                  } else {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setActiveMenu({
                      id: product.id,
                      top: rect.bottom,
                      left: rect.right - 192, // 192px = w-48
                    });
                  }
                }}
                className={`transition-colors p-1.5 rounded-lg ${
                  activeMenu?.id === product.id
                    ? "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white"
                    : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <span className="material-symbols-outlined text-xl">
                  more_vert
                </span>
              </button>
              {activeMenu?.id === product.id && (
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
                        onEdit?.(product);
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
                        onDelete?.(product);
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
            </div>
          );
        },
      }),
    ],
    [activeMenu, onEdit, onDelete]
  );

  const table = useReactTable({
    data: products,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: totalPages,
  });

  return (
    <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-b-xl shadow-sm overflow-hidden hidden md:block">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700"
              >
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={`px-8 py-5 text-left ${
                      header.id === "actions" ? "text-right" : ""
                    }`}
                  >
                    <span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-8 py-4">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
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
