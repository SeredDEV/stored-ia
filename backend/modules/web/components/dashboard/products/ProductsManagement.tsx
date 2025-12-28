"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import NewProductForm from "./product-form/NewProductForm";
import EditProductForm from "./product-form/EditProductForm";
import { ProductHeader } from "./components/ProductHeader";
import { ProductFilters } from "./components/ProductFilters";
import { ProductTable } from "./components/ProductTable";
import { ProductMobileList } from "./components/ProductMobileList";
import { Product, apiToProduct, ProductFormData } from "./types";
import { productService } from "@/lib/api/productService";

const ProductsManagement: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Estado para productos
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado para edición
  const [editingProduct, setEditingProduct] = useState<{data: Partial<ProductFormData>, id: string} | null>(null);

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
    const action = searchParams.get("action");
    const id = searchParams.get("id");

    setShowNewProductForm(action === "new");

    if (action === "edit" && id) {
      // Si ya estamos editando el mismo producto, no recargar
      if (editingProduct?.id !== id) {
        loadProductForEdit(id);
      }
    } else if (editingProduct && action !== "edit") {
        // Si la URL cambió y ya no es edit, limpiar estado
        setEditingProduct(null);
    }
  }, [searchParams]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const apiProducts = await productService.getAll("publicado");
      console.log("Productos cargados (getAll):", apiProducts);
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

  const loadProductForEdit = async (id: string) => {
      try {
        console.log("Iniciando carga de producto para edición:", id);
        const apiProduct = await productService.getById(id);
        console.log("Producto obtenido de API:", apiProduct);
        
        // Mapear ApiProduct a ProductFormData
        const formData: Partial<ProductFormData> = {
            title: apiProduct.titulo,
            subtitle: apiProduct.subtitulo || "",
            handle: apiProduct.slug,
            description: apiProduct.descripcion || "",
            hasVariants: (apiProduct.variantes && apiProduct.variantes.length > 0) || false,
            media: [], 
            existingImages: apiProduct.imagenes?.map((img: any) => ({
              id: img.id,
              url: img.url.trim()
            })) || [],
            options: (apiProduct.variantes && apiProduct.variantes.length > 0) 
              ? [{
                  id: "opt-generated",
                  title: "Variantes",
                  values: apiProduct.variantes.map((v: any) => v.titulo)
                }]
              : [],
            variants: apiProduct.variantes?.map((v: any) => ({
              id: v.id,
              name: v.titulo,
              selected: true,
              title: v.titulo,
              sku: v.sku,
              managedInventory: v.gestionar_inventario,
              allowBackorder: v.permitir_pedido_pendiente,
              hasInventoryKit: false,
              priceCOP: v.precios?.find((p: any) => p.conjunto_precios?.precios?.[0]?.codigo_moneda === "COP")?.conjunto_precios?.precios?.[0]?.monto
                ? (v.precios.find((p: any) => p.conjunto_precios?.precios?.[0]?.codigo_moneda === "COP").conjunto_precios.precios[0].monto).toString() 
                : "",
            })) || [],
            discountApplicable: apiProduct.tiene_descuento,
            type: apiProduct.tipo_producto?.id || "",
            collection: apiProduct.coleccion?.id || "",
            categories: apiProduct.categorias?.map((c: any) => c.categoria.id) || [],
            tags: apiProduct.etiquetas?.map((e: any) => e.etiqueta.id) || [],
            shippingProfile: "", 
            salesChannels: ["Default Sales Channel"],
        };
        
        setEditingProduct({ data: formData, id: id });
      } catch (err) {
        const msg = "Error al cargar el producto para edición: " + (err instanceof Error ? err.message : String(err));
        setError(msg);
        console.error(msg);
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

  const handleCloseEditProduct = () => {
    setEditingProduct(null);
    router.push("/dashboard?view=products");
    loadProducts();
  };

  const handleEditProduct = (product: Product) => {
    router.push(`/dashboard?view=products&action=edit&id=${product.id}`);
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

  if (editingProduct) {
    return (
      <div className="max-w-6xl mx-auto">
        <EditProductForm 
          onClose={handleCloseEditProduct} 
          initialData={editingProduct.data}
          productId={editingProduct.id}
        />
      </div>
    );
  }

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
