"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import NewProductForm from "./product-form/NewProductForm";
import { products } from "./data";
import { ProductHeader } from "./components/ProductHeader";
import { ProductFilters } from "./components/ProductFilters";
import { ProductTable } from "./components/ProductTable";
import { ProductMobileList } from "./components/ProductMobileList";
import { Product } from "./types";

const ProductsManagement: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Estado para la búsqueda global
  const [searchTerm, setSearchTerm] = useState("");

  // Inicializar estado basado en URL
  const [showNewProductForm, setShowNewProductForm] = useState(
    searchParams.get("action") === "new"
  );

  // Sincronizar estado cuando cambia la URL
  useEffect(() => {
    setShowNewProductForm(searchParams.get("action") === "new");
  }, [searchParams]);

  const handleOpenNewProduct = () => {
    setShowNewProductForm(true);
    router.push("/dashboard?view=products&action=new");
  };

  const handleCloseNewProduct = () => {
    setShowNewProductForm(false);
    router.push("/dashboard?view=products");
  };

  const handleEditProduct = (product: Product) => {
    console.log("Edit product:", product);
    // Aquí iría la lógica para editar el producto
  };

  const handleDeleteProduct = (product: Product) => {
    if (confirm(`¿Estás seguro de que deseas eliminar el producto "${product.name}"?`)) {
      console.log("Delete product:", product);
      // Aquí iría la lógica para eliminar el producto
    }
  };

  if (showNewProductForm) {
    return (
      <div className="max-w-6xl mx-auto">
        <NewProductForm onClose={handleCloseNewProduct} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <ProductHeader onOpenNewProduct={handleOpenNewProduct} />

      <ProductFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <ProductTable
        products={products}
        globalFilter={searchTerm}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />

      <ProductMobileList 
        products={products.filter((product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        )} 
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
      />
    </div>
  );
};

export default ProductsManagement;
