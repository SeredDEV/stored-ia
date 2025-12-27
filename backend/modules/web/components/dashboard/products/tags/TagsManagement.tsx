"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ProductTag, CreateProductTagInput } from "./types";
import { apiToTag, tagToApi } from "./types";
import { TagForm } from "./TagForm";
import { TagTable } from "./TagTable";
import { TagMobileList } from "./TagMobileList";
import { DeleteConfirmationModal } from "../collections/DeleteConfirmationModal";
import { tagService } from "@/lib/api/tagService";

const TagsManagement = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [tags, setTags] = useState<ProductTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editingTag, setEditingTag] = useState<ProductTag | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<ProductTag | null>(null);

  // Cargar etiquetas desde la API
  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiTags = await tagService.getAll();
      const transformedTags = apiTags.map(apiToTag);
      setTags(transformedTags);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar las etiquetas"
      );
      console.error("Error loading tags:", err);
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
      setEditingTag(null);
    } else if (action === "edit" && id) {
      const tagToEdit = tags.find((t) => t.id === id);
      if (tagToEdit) {
        setEditingTag(tagToEdit);
        setIsCreating(false);
      }
    } else {
      setIsCreating(false);
      setEditingTag(null);
    }
  }, [searchParams, tags]);

  const handleCreate = async (data: CreateProductTagInput) => {
    try {
      const apiData = tagToApi(data);
      const newTag = await tagService.create(apiData);
      const transformedTag = apiToTag(newTag);
      setTags([transformedTag, ...tags]);
      router.push("/dashboard?view=tags");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al crear la etiqueta"
      );
      console.error("Error creating tag:", err);
    }
  };

  const handleUpdate = async (data: CreateProductTagInput) => {
    if (!editingTag) return;

    try {
      const apiData = tagToApi(data);
      const updatedTag = await tagService.update(editingTag.id, apiData);
      const transformedTag = apiToTag(updatedTag);

      const updatedTags = tags.map((t) =>
        t.id === editingTag.id ? transformedTag : t
      );

      setTags(updatedTags);
      router.push("/dashboard?view=tags");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al actualizar la etiqueta"
      );
      console.error("Error updating tag:", err);
    }
  };

  const handleDeleteClick = (id: string) => {
    const tag = tags.find((t) => t.id === id);
    if (tag) {
      setTagToDelete(tag);
      setDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (tagToDelete) {
      try {
        await tagService.delete(tagToDelete.id);
        setTags(tags.filter((t) => t.id !== tagToDelete.id));
        setTagToDelete(null);
        setDeleteModalOpen(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al eliminar la etiqueta"
        );
        console.error("Error deleting tag:", err);
      }
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/dashboard?view=tags&action=edit&id=${id}`);
  };

  const handleCancel = () => {
    router.push("/dashboard?view=tags");
  };

  // Mostrar estado de carga
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-echo-blue mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Cargando etiquetas...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar error si existe
  if (error && !isCreating && !editingTag) {
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
            onClick={loadTags}
            className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (isCreating || editingTag) {
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
            {editingTag ? "Editar Etiqueta" : "Crear Etiqueta"}
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-6 -mt-4 pl-14">
          Crea una nueva etiqueta para categorizar tus productos.
        </p>
        <TagForm
          onSubmit={editingTag ? handleUpdate : handleCreate}
          onCancel={handleCancel}
          initialData={
            editingTag
              ? { name: editingTag.name, color: editingTag.color }
              : undefined
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
            Etiquetas
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestiona las etiquetas de tus productos.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => router.push("/dashboard?view=tags&action=new")}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-echo-blue hover:bg-echo-blue/90 text-white rounded-lg transition-colors shadow-sm"
          >
            <span className="font-medium">Crear</span>
          </button>
        </div>
      </div>

      {/* Buscador */}
      <div className="mb-6">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#9CA3AF] text-[20px]">
            search
          </span>
          <input
            type="text"
            placeholder="Buscar"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-echo-blue/20 focus:border-echo-blue transition-all"
          />
        </div>
      </div>

      <div className="hidden md:block">
        <TagTable
          tags={tags}
          globalFilter={globalFilter}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      </div>

      <TagMobileList
        tags={tags}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={tagToDelete?.name}
      />
    </div>
  );
};

export default TagsManagement;
