"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProductFilters } from "../components/ProductFilters";
import { ProductTable } from "../components/ProductTable";
import { ProductMobileList } from "../components/ProductMobileList";
import { Product, apiToProduct } from "../types";
import NewProductForm from "../product-form/NewProductForm";
import { productService } from "@/lib/api/productService";

const DraftsManagement: React.FC = () => {
  const router = useRouter();
  const [showNewProductForm, setShowNewProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Estado para la búsqueda global
  const [searchTerm, setSearchTerm] = useState("");
  const [drafts, setDrafts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar borradores al montar el componente
  useEffect(() => {
    loadDrafts();
  }, []);

  const loadDrafts = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiProducts = await productService.getAll("borrador");
      const transformedProducts = apiProducts.map(apiToProduct);
      setDrafts(transformedProducts);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar borradores"
      );
      console.error("Error loading drafts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenNewProduct = () => {
    setEditingProduct(null);
    setShowNewProductForm(true);
  };

  const handleCloseNewProduct = () => {
    setShowNewProductForm(false);
    setEditingProduct(null);
    loadDrafts();
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowNewProductForm(true);
  };

  const handleDeleteProduct = (product: Product) => {
    if (
      confirm(
        `¿Estás seguro de que deseas eliminar el borrador "${product.name}"?`
      )
    ) {
      handleConfirmDelete(product.id);
    }
  };

  const handleConfirmDelete = async (id: string) => {
    try {
      await productService.delete(id);
      await loadDrafts();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al eliminar borrador"
      );
      console.error("Error deleting draft:", err);
    }
  };

  if (showNewProductForm) {
    return (
      <div className="max-w-6xl mx-auto">
        <NewProductForm
          onClose={handleCloseNewProduct}
          initialData={
            editingProduct
              ? {
                  title: editingProduct.name,
                  collection:
                    editingProduct.collection !== "-"
                      ? editingProduct.collection
                      : "",
                }
              : undefined
          }
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 mb-2">{error}</p>
          <button
            onClick={loadDrafts}
            className="text-sm text-red-600 hover:text-red-700 underline"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header Personalizado para Borradores */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
            Borradores
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Gestiona tus productos en preparación antes de publicarlos.
          </p>
        </div>
        <button
          onClick={handleOpenNewProduct}
          className="bg-echo-blue dark:bg-primary hover:bg-echo-blue-variant dark:hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all active:scale-95 font-medium"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Nuevo Borrador
        </button>
      </div>

      <ProductFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        showActions={false}
      />

      <ProductTable
        products={drafts}
        globalFilter={searchTerm}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />

      <ProductMobileList
        products={drafts.filter((product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        )}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />
    </div>
  );
};

export default DraftsManagement;
