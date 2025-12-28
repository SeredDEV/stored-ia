"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import NewProductForm from "./product-form/NewProductForm";
import { ProductHeader } from "./components/ProductHeader";
import { ProductFilters } from "./components/ProductFilters";
import { ProductTable } from "./components/ProductTable";
import { ProductMobileList } from "./components/ProductMobileList";
import { Product, apiToProduct } from "./types";
import { productService } from "@/lib/api/productService";

const ProductsManagement: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Estado para productos
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado para la búsqueda global
  const [searchTerm, setSearchTerm] = useState("");

  // Inicializar estado basado en URL
  const [showNewProductForm, setShowNewProductForm] = useState(
    searchParams.get("action") === "new"
  );

  // Cargar productos
  useEffect(() => {
    loadProducts();
  }, []);

  // Sincronizar estado cuando cambia la URL
  useEffect(() => {
    setShowNewProductForm(searchParams.get("action") === "new");
  }, [searchParams]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiProducts = await productService.getAll("publicado");
      const transformedProducts = apiProducts.map(apiToProduct);
      setProducts(transformedProducts);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cargar productos"
      );
      console.error("Error loading products:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenNewProduct = () => {
    setShowNewProductForm(true);
    router.push("/dashboard?view=products&action=new");
  };

  const handleCloseNewProduct = () => {
    setShowNewProductForm(false);
    router.push("/dashboard?view=products");
    // Recargar la lista de productos después de cerrar el formulario
    loadProducts();
  };

  const handleEditProduct = (product: Product) => {
    // Ejecutar GET para cargar datos completos del producto
    fetch(`/api/productos/${product.id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Producto cargado:", data.data);
      })
      .catch((err) => {
        setError("Error al cargar el producto");
        console.error("Error:", err);
      });
  };

  const handleDeleteProduct = (product: Product) => {
    if (
      confirm(
        `¿Estás seguro de que deseas eliminar el producto "${product.name}"?`
      )
    ) {
      handleConfirmDelete(product.id);
    }
  };

  const handleConfirmDelete = async (id: string) => {
    try {
      await productService.delete(id);
      await loadProducts();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al eliminar producto"
      );
      console.error("Error deleting product:", err);
    }
  };

  if (showNewProductForm) {
    return (
      <div className="max-w-6xl mx-auto">
        <NewProductForm onClose={handleCloseNewProduct} />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 mb-2">{error}</p>
          <button
            onClick={loadProducts}
            className="text-sm text-red-600 hover:text-red-700 underline"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <ProductHeader onOpenNewProduct={handleOpenNewProduct} />

      <ProductFilters searchTerm={searchTerm} onSearchChange={setSearchTerm} />

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
