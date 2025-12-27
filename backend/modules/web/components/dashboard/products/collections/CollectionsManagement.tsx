"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Collection, CreateCollectionInput } from "./types";
import { apiToCollection, collectionToApi } from "./types";
import { CollectionForm } from "./CollectionForm";
import { CollectionTable } from "./CollectionTable";
import { CollectionMobileList } from "./CollectionMobileList";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import { collectionService } from "@/lib/api/collectionService";

const CollectionsManagement = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [globalFilter, setGlobalFilter] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(
    null
  );
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [collectionToDelete, setCollectionToDelete] =
    useState<Collection | null>(null);

  // Cargar colecciones desde la API
  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiCollections = await collectionService.getAll();
      const transformedCollections = apiCollections.map(apiToCollection);
      setCollections(transformedCollections);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar las colecciones"
      );
      console.error("Error loading collections:", err);
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
      setEditingCollection(null);
    } else if (action === "edit" && id) {
      const collectionToEdit = collections.find((c) => c.id === id);
      if (collectionToEdit) {
        setEditingCollection(collectionToEdit);
        setIsCreating(false);
      }
    } else {
      setIsCreating(false);
      setEditingCollection(null);
    }
  }, [searchParams, collections]);

  const handleCreate = async (data: CreateCollectionInput) => {
    try {
      const apiData = collectionToApi(data);
      const newCollection = await collectionService.create(apiData);
      const transformedCollection = apiToCollection(newCollection);
      setCollections([transformedCollection, ...collections]);
      router.push("/dashboard?view=collections");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al crear la colección"
      );
      console.error("Error creating collection:", err);
    }
  };

  const handleUpdate = async (data: CreateCollectionInput) => {
    if (!editingCollection) return;

    try {
      const apiData = collectionToApi(data);
      const updatedCollection = await collectionService.update(
        editingCollection.id,
        apiData
      );
      const transformedCollection = apiToCollection(updatedCollection);

      const updatedCollections = collections.map((c) =>
        c.id === editingCollection.id ? transformedCollection : c
      );

      setCollections(updatedCollections);
      router.push("/dashboard?view=collections");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al actualizar la colección"
      );
      console.error("Error updating collection:", err);
    }
  };

  const handleDeleteClick = (id: string) => {
    const collection = collections.find((c) => c.id === id);
    if (collection) {
      setCollectionToDelete(collection);
      setDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (collectionToDelete) {
      try {
        await collectionService.delete(collectionToDelete.id);
        setCollections(
          collections.filter((c) => c.id !== collectionToDelete.id)
        );
        setCollectionToDelete(null);
        setDeleteModalOpen(false);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al eliminar la colección"
        );
        console.error("Error deleting collection:", err);
      }
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/dashboard?view=collections&action=edit&id=${id}`);
  };

  const handleCancel = () => {
    router.push("/dashboard?view=collections");
  };

  // Mostrar estado de carga
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-echo-blue mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">
              Cargando colecciones...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar error si existe
  if (error && !isCreating && !editingCollection) {
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
            onClick={loadCollections}
            className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (isCreating || editingCollection) {
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
            {editingCollection ? "Editar Colección" : "Nueva Colección"}
          </h1>
        </div>
        <CollectionForm
          onSubmit={editingCollection ? handleUpdate : handleCreate}
          onCancel={handleCancel}
          initialData={
            editingCollection
              ? {
                  title: editingCollection.title,
                  slug: editingCollection.slug,
                }
              : undefined
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
            Colecciones
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestiona las colecciones para organizar tus productos.
          </p>
        </div>
        <button
          onClick={() => router.push("/dashboard?view=collections&action=new")}
          className="flex items-center gap-2 px-4 py-2 bg-echo-blue hover:bg-echo-blue/90 text-white rounded-lg transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span className="font-medium">Crear Colección</span>
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">
            search
          </span>
          <input
            type="text"
            placeholder="Buscar colecciones..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-echo-blue/50 text-gray-700 dark:text-gray-200 placeholder-gray-400 transition-all"
          />
        </div>
      </div>

      <div className="hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <CollectionTable
          collections={collections}
          globalFilter={globalFilter}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      </div>

      <div className="mt-6 md:hidden">
        <CollectionMobileList
          collections={collections}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      </div>

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={collectionToDelete?.title}
      />
    </div>
  );
};

export default CollectionsManagement;
