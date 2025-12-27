"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Category, CreateCategoryInput } from "./types";
import { apiToCategory, categoryToApi } from "./types";
import { CategoryForm } from "./CategoryForm";
import { CategoryTable } from "./CategoryTable";
import { CategoryRanking } from "./CategoryRanking";
import { DeleteConfirmationModal } from "../collections/DeleteConfirmationModal";
import { categoryService } from "@/lib/api/categoryService";

const CategoriesManagement = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isRanking, setIsRanking] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );

  // Estado para la búsqueda global
  const [searchTerm, setSearchTerm] = useState("");

  // Cargar categorías desde la API
  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiCategories = await categoryService.getAll();
      const transformedCategories = apiCategories.map(apiToCategory);
      setCategories(transformedCategories);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar las categorías"
      );
      console.error("Error loading categories:", err);
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
      setEditingCategory(null);
      setIsRanking(false);
    } else if (action === "edit" && id) {
      const categoryToEdit = categories.find((c) => c.id === id);
      if (categoryToEdit) {
        setEditingCategory(categoryToEdit);
        setIsCreating(false);
        setIsRanking(false);
      }
    } else if (action === "ranking") {
      setIsCreating(false);
      setEditingCategory(null);
      setIsRanking(true);
    } else {
      setIsCreating(false);
      setEditingCategory(null);
      setIsRanking(false);
    }
  }, [searchParams, categories]);

  const handleCreate = async (data: CreateCategoryInput) => {
    try {
      const apiData = categoryToApi(data);
      const newCategory = await categoryService.create(apiData);
      const transformedCategory = apiToCategory(newCategory);
      setCategories([transformedCategory, ...categories]);
      router.push("/dashboard?view=categories");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al crear la categoría"
      );
      console.error("Error creating category:", err);
    }
  };

  const handleUpdate = async (data: CreateCategoryInput) => {
    if (!editingCategory) return;

    try {
      const apiData = categoryToApi(data);
      const updatedCategory = await categoryService.update(
        editingCategory.id,
        apiData
      );
      const transformedCategory = apiToCategory(updatedCategory);

      const updatedCategories = categories.map((c) =>
        c.id === editingCategory.id ? transformedCategory : c
      );

      setCategories(updatedCategories);
      router.push("/dashboard?view=categories");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al actualizar la categoría"
      );
      console.error("Error updating category:", err);
    }
  };

  const handleSaveRanking = (newOrder: Category[]) => {
    // TODO: Implementar actualización de ranking en el backend
    setCategories(newOrder);
    router.push("/dashboard?view=categories");
  };

  const handleDeleteClick = (id: string) => {
    const category = categories.find((c) => c.id === id);
    if (category) {
      setCategoryToDelete(category);
      setDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (categoryToDelete) {
      try {
        await categoryService.delete(categoryToDelete.id);
        setCategories(categories.filter((c) => c.id !== categoryToDelete.id));
        setCategoryToDelete(null);
        setDeleteModalOpen(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al eliminar la categoría"
        );
        console.error("Error deleting category:", err);
      }
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/dashboard?view=categories&action=edit&id=${id}`);
  };

  const handleCancel = () => {
    router.push("/dashboard?view=categories");
  };

  // Mostrar estado de carga
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-echo-blue mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Cargando categorías...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar error si existe
  if (error && !isCreating && !editingCategory) {
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
            onClick={loadCategories}
            className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (isCreating || editingCategory) {
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
            {editingCategory ? "Editar Categoría" : "Crear Categoría"}
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-6 -mt-4 pl-14">
          Crea una nueva categoría para organizar tus productos.
        </p>
        <CategoryForm
          onSubmit={editingCategory ? handleUpdate : handleCreate}
          onCancel={handleCancel}
          initialData={
            editingCategory
              ? {
                  name: editingCategory.name,
                  slug: editingCategory.slug,
                  description: editingCategory.description,
                  status: editingCategory.status,
                  visibility: editingCategory.visibility,
                }
              : undefined
          }
        />
      </div>
    );
  }

  if (isRanking) {
    return (
      <CategoryRanking
        categories={categories}
        onSave={handleSaveRanking}
        onCancel={() => router.push("/dashboard?view=categories")}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
            Categorías
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Organiza productos en categorías, y administra el ranking y
            jerarquía de esas categorías.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() =>
              router.push("/dashboard?view=categories&action=ranking")
            }
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
          >
            Editar ranking
          </button>
          <button
            onClick={() => router.push("/dashboard?view=categories&action=new")}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-echo-blue hover:bg-echo-blue/90 text-white rounded-lg transition-colors shadow-sm"
          >
            <span className="font-medium">Crear</span>
          </button>
        </div>
      </div>

      {/* Buscador (Placeholder visual) */}
      <div className="mb-6">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <span className="material-symbols-outlined text-xl">search</span>
          </span>
          <input
            type="text"
            placeholder="Buscar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-echo-blue dark:focus:ring-primary focus:border-transparent dark:text-gray-200 dark:placeholder-gray-500 transition-shadow"
          />
        </div>
      </div>

      <CategoryTable
        categories={categories}
        globalFilter={searchTerm}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      {/* 
      <CategoryMobileList 
        categories={categories} 
        onEdit={handleEdit} 
        onDelete={handleDeleteClick} 
      />
      */}

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={categoryToDelete?.name}
      />
    </div>
  );
};

export default CategoriesManagement;
