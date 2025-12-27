"use client";
import React, { useState, useMemo, useEffect } from "react";
import { ProductType } from "./types";
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

interface TypeTableProps {
  types: ProductType[];
  globalFilter: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const columnHelper = createColumnHelper<ProductType>();

const DraggableTableHeader = ({
  header,
  children,
}: {
  header: Header<ProductType, unknown>;
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

export const TypeTable: React.FC<TypeTableProps> = ({
  types,
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
    "createdAt",
    "updatedAt",
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
      columnHelper.accessor("name", {
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
              <span className="material-symbols-outlined text-[18px]">style</span>
            </div>
            <span className="font-medium text-gray-900 dark:text-white">
              {info.getValue()}
            </span>
          </div>
        ),
      }),
      columnHelper.accessor("createdAt", {
        header: ({ column }) => (
          <div className="flex items-center gap-2 w-full">
            <span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
              Creado en
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
      columnHelper.accessor("updatedAt", {
        header: ({ column }) => (
          <div className="flex items-center gap-2 w-full">
            <span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
              Actualizado en
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
                    top: rect.bottom + window.scrollY + 4,
                    left: rect.right + window.scrollX - 160,
                  });
                }
              }}
              className="transition-colors p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <span className="material-symbols-outlined text-[20px]">more_vert</span>
            </button>
          </div>
        ),
      }),
    ],
    [activeMenu]
  );

  const table = useReactTable({
    data: types,
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
    useSensor(PointerSensor),
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
      if (activeMenu && !(event.target as Element).closest('.action-menu-container')) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeMenu]);

  return (
    <div className="overflow-x-auto">
      {activeMenu && (
        <div 
          className="fixed z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-100 dark:border-gray-700 py-1 w-40 animate-in fade-in zoom-in-95 duration-100"
          style={{ top: activeMenu.top, left: activeMenu.left }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => {
              onEdit?.(activeMenu.id);
              setActiveMenu(null);
            }}
            className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
            Editar
          </button>
          <button
            onClick={() => {
              onDelete?.(activeMenu.id);
              setActiveMenu(null);
            }}
            className="w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">delete</span>
            Eliminar
          </button>
        </div>
      )}

      <DndContext
        id="dnd-context-types"
        collisionDetection={closestCenter}
        modifiers={[
          (args) => ({
            ...args.transform,
            y: 0,
          }),
        ]}
        sensors={sensors}
        onDragEnd={handleDragEnd}
      >
        <table className="w-full text-left border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="bg-gray-50/50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700"
              >
                <SortableContext
                  items={columnOrder}
                  strategy={horizontalListSortingStrategy}
                >
                  {headerGroup.headers.map((header) => (
                    <DraggableTableHeader key={header.id} header={header}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </DraggableTableHeader>
                  ))}
                </SortableContext>
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all duration-200"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-6 py-4">
                    <SortableContext
                      items={columnOrder}
                      strategy={horizontalListSortingStrategy}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </SortableContext>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </DndContext>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Mostrando {table.getRowModel().rows.length} de {types.length} tipos
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
          </button>
          <span className="text-sm text-gray-600 dark:text-gray-300 min-w-[3ch] text-center">
            {table.getState().pagination.pageIndex + 1}
          </span>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  );
};
