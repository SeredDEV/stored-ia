"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ProductType, CreateProductTypeInput } from "./types";
import { apiToType, typeToApi } from "./types";
import { TypeForm } from "./TypeForm";
import { TypeTable } from "./TypeTable";
import { TypeMobileList } from "./TypeMobileList";
import { DeleteConfirmationModal } from "../collections/DeleteConfirmationModal";
import { typeService } from "@/lib/api/typeService";

const TypesManagement = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [types, setTypes] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editingType, setEditingType] = useState<ProductType | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [typeToDelete, setTypeToDelete] = useState<ProductType | null>(null);

  // Cargar tipos desde la API
  useEffect(() => {
    loadTypes();
  }, []);

  const loadTypes = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiTypes = await typeService.getAll();
      const transformedTypes = apiTypes.map(apiToType);
      setTypes(transformedTypes);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar los tipos"
      );
      console.error("Error loading types:", err);
    } finally {
      setLoading(false);
    }
  };

  // Sincronizar estado con URL
  useEffect(() => {
    const action = searchParams.get("action");
    const id = searchParams.get("id");

    if (action === "new") {
      setIsCreating(true);
      setEditingType(null);
    } else if (action === "edit" && id) {
      const typeToEdit = types.find((t) => t.id === id);
      if (typeToEdit) {
        setEditingType(typeToEdit);
        setIsCreating(false);
      }
    } else {
      setIsCreating(false);
      setEditingType(null);
    }
  }, [searchParams, types]);

  const handleCreate = async (data: CreateProductTypeInput) => {
    try {
      const apiData = typeToApi(data);
      const newType = await typeService.create(apiData);
      const transformedType = apiToType(newType);
      setTypes([transformedType, ...types]);
      router.push("/dashboard?view=types");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al crear el tipo");
      console.error("Error creating type:", err);
    }
  };

  const handleUpdate = async (data: CreateProductTypeInput) => {
    if (!editingType) return;

    try {
      const apiData = typeToApi(data);
      const updatedType = await typeService.update(editingType.id, apiData);
      const transformedType = apiToType(updatedType);

      const updatedTypes = types.map((t) =>
        t.id === editingType.id ? transformedType : t
      );

      setTypes(updatedTypes);
      router.push("/dashboard?view=types");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al actualizar el tipo"
      );
      console.error("Error updating type:", err);
    }
  };

  const handleDeleteClick = (id: string) => {
    const type = types.find((t) => t.id === id);
    if (type) {
      setTypeToDelete(type);
      setDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (typeToDelete) {
      try {
        await typeService.delete(typeToDelete.id);
        setTypes(types.filter((t) => t.id !== typeToDelete.id));
        setTypeToDelete(null);
        setDeleteModalOpen(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al eliminar el tipo"
        );
        console.error("Error deleting type:", err);
      }
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/dashboard?view=types&action=edit&id=${id}`);
  };

  const handleCancel = () => {
    router.push("/dashboard?view=types");
  };

  // Mostrar estado de carga
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-echo-blue mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Cargando tipos...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar error si existe
  if (error && !isCreating && !editingType) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-red-600 dark:text-red-400">
              error
            </span>
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
          <button
            onClick={loadTypes}
            className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (isCreating || editingType) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={handleCancel}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            {editingType ? "Editar Tipo de Producto" : "Crear Tipo de Producto"}
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-6 -mt-4 pl-14">
          Crea un nuevo tipo de producto para categorizar tus productos.
        </p>
        <TypeForm
          onSubmit={editingType ? handleUpdate : handleCreate}
          onCancel={handleCancel}
          initialData={editingType ? { name: editingType.name } : undefined}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
            Tipos de Producto
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Organiza tus productos en tipos.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => router.push("/dashboard?view=types&action=new")}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-echo-blue hover:bg-echo-blue/90 text-white rounded-lg transition-colors shadow-sm"
          >
            <span className="font-medium">Crear</span>
          </button>
        </div>
      </div>

      {/* Buscador */}
      <div className="mb-6">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">
            search
          </span>
          <input
            type="text"
            placeholder="Buscar tipos..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-echo-blue/50 text-gray-700 dark:text-gray-200 placeholder-gray-400 transition-all"
          />
        </div>
      </div>

      <div className="hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <TypeTable
          types={types}
          globalFilter={globalFilter}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      </div>

      <TypeMobileList
        types={types}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={typeToDelete?.name}
      />
    </div>
  );
};

export default TypesManagement;
