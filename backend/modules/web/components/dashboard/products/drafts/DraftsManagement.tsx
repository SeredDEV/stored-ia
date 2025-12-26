"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useProductFiltering } from "../hooks/useProductFiltering";
import { ProductFilters } from "../components/ProductFilters";
import { ProductTable } from "../components/ProductTable";
import { ProductMobileList } from "../components/ProductMobileList";
import { Product } from "../types";
import NewProductForm from "../product-form/NewProductForm";

// Mock data para borradores
const DRAFT_PRODUCTS: Product[] = [
  {
    id: "d1",
    name: "Camisa Lino Prototipo",
    icon: "checkroom",
    collection: "Verano 2025",
    salesChannel: "-",
    variants: 2,
    status: "Borrador",
  },
  {
    id: "d2",
    name: "Zapatillas Running V2",
    icon: "checkroom",
    collection: "-",
    salesChannel: "-",
    variants: 5,
    status: "Borrador",
  },
  {
    id: "d3",
    name: "Mochila Viaje Concepto",
    icon: "backpack",
    collection: "Accesorios",
    salesChannel: "-",
    variants: 1,
    status: "Borrador",
  },
  {
    id: "d4",
    name: "Smart Watch Sport Edition",
    icon: "watch",
    collection: "Tecnología",
    salesChannel: "-",
    variants: 3,
    status: "Borrador",
  },
];

const DraftsManagement: React.FC = () => {
  const router = useRouter();
  const [showNewProductForm, setShowNewProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Hook personalizado para lógica de filtrado y paginación
  const {
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    paginatedProducts,
    totalProducts,
    totalPages,
  } = useProductFiltering(DRAFT_PRODUCTS);

  const handleOpenNewProduct = () => {
    setEditingProduct(null);
    setShowNewProductForm(true);
  };

  const handleCloseNewProduct = () => {
    setShowNewProductForm(false);
    setEditingProduct(null);
  };

  const handleEditProduct = (product: Product) => {
    // Aquí mapearíamos el objeto Product a ProductFormData si fuera necesario
    // Por ahora, pasamos el producto tal cual y dejamos que el formulario maneje lo que coincida
    setEditingProduct(product);
    setShowNewProductForm(true);
  };

  const handleDeleteProduct = (product: Product) => {
    if (confirm(`¿Estás seguro de que deseas eliminar el borrador "${product.name}"?`)) {
      console.log("Delete draft:", product);
      // Lógica para eliminar borrador
    }
  };

  if (showNewProductForm) {
    return (
      <div className="max-w-6xl mx-auto">
        <NewProductForm 
          onClose={handleCloseNewProduct} 
          initialData={editingProduct ? {
            title: editingProduct.name,
            collection: editingProduct.collection !== "-" ? editingProduct.collection : "",
            // Otros campos se mapearían aquí
          } : undefined}
        />
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
        products={paginatedProducts}
        currentPage={currentPage}
        itemsPerPage={11}
        totalProducts={totalProducts}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />

      <ProductMobileList 
        products={paginatedProducts} 
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />
    </div>
  );
};

export default DraftsManagement;
