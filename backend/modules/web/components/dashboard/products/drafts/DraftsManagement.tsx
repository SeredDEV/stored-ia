"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ProductFilters } from "../components/ProductFilters";
import { ProductTable } from "../components/ProductTable";
import { ProductMobileList } from "../components/ProductMobileList";
import { Product } from "../types";
import NewProductForm from "../product-form/NewProductForm";

import { faker } from '@faker-js/faker';

// Establecer una semilla diferente para borradores
faker.seed(456);

// Mock data para borradores generado con faker
const DRAFT_PRODUCTS: Product[] = Array.from({ length: 20 }, () => ({
  id: faker.string.uuid(),
  name: faker.commerce.productName(),
  icon: "checkroom",
  image: faker.datatype.boolean() ? faker.image.urlLoremFlickr({ category: 'fashion', width: 100, height: 100 }) : undefined,
  collection: faker.commerce.department(),
  salesChannel: "-",
  variants: faker.number.int({ min: 1, max: 10 }),
  status: "Borrador",
}));

const DraftsManagement: React.FC = () => {
  const router = useRouter();
  const [showNewProductForm, setShowNewProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Estado para la búsqueda global
  const [searchTerm, setSearchTerm] = useState("");

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
        products={DRAFT_PRODUCTS}
        globalFilter={searchTerm}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />

      <ProductMobileList 
        products={DRAFT_PRODUCTS.filter((product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        )} 
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />
    </div>
  );
};

export default DraftsManagement;
