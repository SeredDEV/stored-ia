import React, { useState, useEffect, useMemo } from "react";
import { Product } from "../types";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
  ColumnFiltersState,
} from "@tanstack/react-table";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface ProductTableProps {
  products: Product[];
  globalFilter: string;
  onEdit?: (product: Product) => void;
  onDelete?: (product: Product) => void;
}

const columnHelper = createColumnHelper<Product>();

const DraggableTableHeader = ({
  header,
  children,
}: {
  header: any;
  children: React.ReactNode;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: header.column.id,
    });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    zIndex: isDragging ? 1 : 0,
    whiteSpace: "nowrap",
  };

  return (
    <th
      ref={setNodeRef}
      style={style}
      className={`group px-6 py-4 text-left transition-colors relative ${
        header.column.getCanSort()
          ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
          : ""
      } ${header.column.id === "actions" ? "text-right" : ""}`}
      onClick={header.column.getToggleSortingHandler()}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          {children}
        </div>
        {header.column.getCanSort() && header.id !== "actions" && (
          <span className="material-symbols-outlined text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity text-sm cursor-grab active:cursor-grabbing select-none" title="Arrastrar para reordenar">
            drag_indicator
          </span>
        )}
      </div>
    </th>
  );
};

export const ProductTable: React.FC<ProductTableProps> = ({
  products,
  globalFilter,
  onEdit,
  onDelete,
}) => {
  const [activeMenu, setActiveMenu] = useState<{
    id: string;
    top: number;
    left: number;
  } | null>(null);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnOrder, setColumnOrder] = useState<string[]>([
    "name",
    "collection",
    "salesChannel",
    "variants",
    "status",
    "actions",
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setColumnOrder((order) => {
        const oldIndex = order.indexOf(active.id as string);
        const newIndex = order.indexOf(over.id as string);
        return arrayMove(order, oldIndex, newIndex);
      });
    }
  };

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
        header: ({ column }) => (
          <div className="flex items-center gap-2">
            <span>ESTADO</span>
            <div className="relative group/select" onClick={(e) => e.stopPropagation()}>
              <select
                value={(column.getFilterValue() as string) ?? ""}
                onChange={(e) => column.setFilterValue(e.target.value)}
                className="appearance-none bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md text-xs font-medium py-1 pl-2.5 pr-7 text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 cursor-pointer transition-colors border-none"
              >
                <option value="">Todos</option>
                <option value="Publicado">Publicado</option>
                <option value="Borrador">Borrador</option>
                <option value="Inactivo">Inactivo</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1.5 text-gray-500 group-hover/select:text-gray-700 dark:text-gray-400">
                <span className="material-symbols-outlined text-[16px]">
                  expand_more
                </span>
              </div>
            </div>
          </div>
        ),
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
        enableSorting: false,
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
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnOrder,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 11,
      },
    },
  });

  return (
    <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-b-xl shadow-sm overflow-hidden hidden md:block">
      <DndContext
        id="product-table-dnd"
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr
                  key={headerGroup.id}
                  className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700"
                >
                  <SortableContext
                    items={columnOrder}
                    strategy={horizontalListSortingStrategy}
                  >
                    {headerGroup.headers.map((header) => (
                      <DraggableTableHeader key={header.id} header={header}>
                        <div
                          className={`flex items-center gap-2 w-full ${
                            header.id === "actions" ? "justify-end" : ""
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
                          {{
                            asc: (
                              <span className="material-symbols-outlined text-sm">
                                keyboard_arrow_up
                              </span>
                            ),
                            desc: (
                              <span className="material-symbols-outlined text-sm">
                                keyboard_arrow_down
                              </span>
                            ),
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      </DraggableTableHeader>
                    ))}
                  </SortableContext>
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
      </DndContext>
      <div className="px-8 py-5 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between bg-white dark:bg-surface-dark">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Mostrando{" "}
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {table.getFilteredRowModel().rows.length > 0
              ? table.getState().pagination.pageIndex *
                  table.getState().pagination.pageSize +
                1
              : 0}
          </span>{" "}
          a{" "}
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {Math.min(
              (table.getState().pagination.pageIndex + 1) *
                table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}
          </span>{" "}
          de{" "}
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {table.getFilteredRowModel().rows.length}
          </span>{" "}
          resultados
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {table.getState().pagination.pageIndex + 1} de {table.getPageCount()} páginas
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Anterior
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
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
