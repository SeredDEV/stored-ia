"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Collection } from "./types";
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
  Header,
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

interface CollectionTableProps {
  collections: Collection[];
  globalFilter: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const columnHelper = createColumnHelper<Collection>();

const DraggableTableHeader = ({
  header,
  children,
}: {
  header: Header<Collection, unknown>;
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
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          {children}
        </div>
        {header.column.getCanSort() && header.id !== "actions" && (
          <span
            {...listeners}
            className="material-symbols-outlined text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity text-sm cursor-grab active:cursor-grabbing select-none p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
            title="Arrastrar para reordenar"
            onClick={(e) => e.stopPropagation()}
          >
            drag_indicator
          </span>
        )}
      </div>
    </th>
  );
};

export const CollectionTable: React.FC<CollectionTableProps> = ({
  collections,
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
    "title",
    "slug",
    "productsCount",
    "createdAt",
    "actions",
  ]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("title", {
        header: ({ column }) => (
          <div className="flex items-center gap-2 w-full">
            <span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
              Nombre
            </span>
            {{
              asc: <span className="material-symbols-outlined text-sm">keyboard_arrow_up</span>,
              desc: <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>,
            }[column.getIsSorted() as string] || null}
          </div>
        ),
        cell: (info) => (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 flex-shrink-0">
              <span className="material-symbols-outlined text-[18px]">collections_bookmark</span>
            </div>
            <span className="font-medium text-gray-900 dark:text-white">
              {info.getValue()}
            </span>
          </div>
        ),
      }),
      columnHelper.accessor("slug", {
        header: ({ column }) => (
          <div className="flex items-center gap-2 w-full">
            <span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
              Manejo
            </span>
            {{
              asc: <span className="material-symbols-outlined text-sm">keyboard_arrow_up</span>,
              desc: <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>,
            }[column.getIsSorted() as string] || null}
          </div>
        ),
        cell: (info) => (
          <code className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-800 text-xs font-mono text-gray-600 dark:text-gray-300">
            {info.getValue()}
          </code>
        ),
      }),
      columnHelper.accessor("productsCount", {
        header: ({ column }) => (
          <div className="flex items-center gap-2 w-full">
            <span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
              Productos
            </span>
            {{
              asc: <span className="material-symbols-outlined text-sm">keyboard_arrow_up</span>,
              desc: <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>,
            }[column.getIsSorted() as string] || null}
          </div>
        ),
        cell: (info) => (
          <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
            <span className="material-symbols-outlined text-[16px]">inventory_2</span>
            <span className="text-sm">{info.getValue()}</span>
          </div>
        ),
      }),
      columnHelper.accessor("createdAt", {
        header: ({ column }) => (
          <div className="flex items-center gap-2 w-full">
            <span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
              Creado
            </span>
            {{
              asc: <span className="material-symbols-outlined text-sm">keyboard_arrow_up</span>,
              desc: <span className="material-symbols-outlined text-sm">keyboard_arrow_down</span>,
            }[column.getIsSorted() as string] || null}
          </div>
        ),
        cell: (info) => (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {formatDate(info.getValue())}
          </span>
        ),
      }),
      columnHelper.display({
        id: "actions",
        header: () => (
          <div className="flex items-center gap-2 w-full justify-end">
            <span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
              Acciones
            </span>
          </div>
        ),
        cell: (info) => (
          <div className="text-right action-menu-container">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (activeMenu?.id === info.row.original.id) {
                  setActiveMenu(null);
                } else {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setActiveMenu({
                    id: info.row.original.id,
                    top: rect.bottom,
                    left: rect.right - 192,
                  });
                }
              }}
              className={`transition-colors p-1.5 rounded-lg ${
                activeMenu?.id === info.row.original.id
                  ? "bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-white"
                  : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                more_vert
              </span>
            </button>
            {activeMenu?.id === info.row.original.id && (
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
                      onEdit?.(info.row.original.id);
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
                      onDelete?.(info.row.original.id);
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
        ),
      }),
    ],
    [activeMenu, onEdit, onDelete, sorting]
  );

  const table = useReactTable({
    data: collections,
    columns,
    state: {
      sorting,
      columnFilters,
      columnOrder,
      globalFilter,
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
    if (active.id !== over?.id) {
      setColumnOrder((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over?.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        activeMenu &&
        !(event.target as Element).closest(".action-menu-container")
      ) {
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
    <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
      <DndContext
        id="collection-table-dnd"
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                <SortableContext
                  items={columnOrder}
                  strategy={horizontalListSortingStrategy}
                >
                  {table.getHeaderGroups().map((headerGroup) =>
                    headerGroup.headers.map((header) => (
                      <DraggableTableHeader key={header.id} header={header}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </DraggableTableHeader>
                    ))
                  )}
                </SortableContext>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {table.getRowModel().rows.length === 0 ? (
                <tr>
                   <td colSpan={columns.length} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                      <span className="material-symbols-outlined text-4xl mb-2 opacity-50">collections_bookmark</span>
                      <p className="text-sm">No se encontraron colecciones</p>
                    </div>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-8 py-4">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
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
            {table.getPageCount() > 0 ? table.getState().pagination.pageIndex + 1 : 0} de {table.getPageCount()} páginas
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
