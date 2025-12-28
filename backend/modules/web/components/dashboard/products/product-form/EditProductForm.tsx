"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { categoryService } from "@/lib/api/categoryService";
import { tagService } from "@/lib/api/tagService";
import { collectionService } from "@/lib/api/collectionService";
import { typeService } from "@/lib/api/typeService";
import { productService } from "@/lib/api/productService";
import { ProductFormData } from "../types";

interface EditProductFormProps {
  onClose?: () => void;
  initialData: Partial<ProductFormData>;
  productId: string;
}

const EditProductForm: React.FC<EditProductFormProps> = ({
  onClose,
  initialData,
  productId,
}) => {
  const router = useRouter();
  
  const [formData, setFormData] = useState<ProductFormData>({
    title: initialData.title || "",
    subtitle: initialData.subtitle || "",
    handle: initialData.handle || "",
    description: initialData.description || "",
    hasVariants: initialData.hasVariants || false,
    media: initialData.media || [],
    options: initialData.options || [],
    variants: initialData.variants || [],
    discountApplicable: initialData.discountApplicable || false,
    type: initialData.type || "",
    collection: initialData.collection || "",
    categories: initialData.categories || [],
    tags: initialData.tags || [],
    shippingProfile: initialData.shippingProfile || "",
    salesChannels: initialData.salesChannels || ["Default Sales Channel"],
  });

  // Estados para las listas de organizar
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [types, setTypes] = useState<any[]>([]);
  const [loadingOrganizeData, setLoadingOrganizeData] = useState(false);

  // Estados para guardar
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Cargar datos de organizar
  useEffect(() => {
    const fetchOrganizeData = async () => {
      setLoadingOrganizeData(true);
      try {
        const [categoriesData, tagsData, collectionsData, typesData] =
          await Promise.all([
            categoryService.getAll(),
            tagService.getAll(),
            collectionService.getAll(),
            typeService.getAll(),
          ]);

        setCategories(categoriesData || []);
        setTags(tagsData || []);
        setCollections(collectionsData || []);
        setTypes(typesData || []);
      } catch (error) {
        console.error("Error al cargar datos de organizar:", error);
      } finally {
        setLoadingOrganizeData(false);
      }
    };

    fetchOrganizeData();
  }, []);

  const handleClose = () => {
    const confirmar = window.confirm("¿Deseas descartar los cambios?");
    if (confirmar) {
      if (onClose) {
        onClose();
      } else {
        router.push("/dashboard?view=products");
      }
    }
  };

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProduct = async (isDraft: boolean = false) => {
    try {
      setIsSaving(true);
      setSaveError(null);

      if (!formData.title || formData.title.trim() === "") {
        throw new Error("El título es requerido");
      }

      const productData: any = {
        titulo: formData.title.trim(),
        slug: formData.handle.trim(),
        tiene_descuento: formData.discountApplicable,
        estado: isDraft ? "borrador" : "publicado",
      };

      if (formData.subtitle?.trim()) {
        productData.subtitulo = formData.subtitle.trim();
      }
      if (formData.description?.trim()) {
        productData.descripcion = formData.description.trim();
      }
      if (formData.type) {
        productData.tipo_producto_id = formData.type;
      }
      if (formData.collection) {
        productData.coleccion_id = formData.collection;
      }

      await productService.update(productId, productData);

      if (onClose) {
        onClose();
      } else {
        router.push("/dashboard?view=products");
      }
    } catch (error: any) {
      setSaveError(error.message || "Error al actualizar el producto");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark transition-colors duration-200 min-h-screen p-6 font-sans">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Header & General Info */}
          <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded shadow-sm bg-white dark:bg-[#1E1E1E]">
            <div className="p-6 flex justify-between items-start border-b border-border-light dark:border-border-dark">
              <div className="flex-1 mr-4">
                 <label className="block text-xs text-text-secondary-light dark:text-text-secondary-dark mb-1">Título</label>
                 <input 
                    type="text" 
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="text-xl font-semibold bg-transparent border-b border-transparent hover:border-gray-300 focus:border-primary focus:ring-0 w-full px-0 py-1 transition-colors"
                    placeholder="Nombre del producto"
                 />
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  <span className="w-2 h-2 mr-1.5 rounded-full bg-green-500"></span>
                  Publicado
                </span>
                <button onClick={() => handleSaveProduct(false)} className="px-4 py-2 bg-primary text-white text-sm rounded hover:bg-primary/90 transition-colors">
                    {isSaving ? "Guardando..." : "Guardar"}
                </button>
                <button onClick={handleClose} className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors">
                  <span className="material-symbols-outlined text-xl">close</span>
                </button>
              </div>
            </div>
            
            <div className="divide-y divide-border-light dark:divide-border-dark text-sm">
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <span className="text-text-secondary-light dark:text-text-secondary-dark font-medium">Descripción</span>
                <div className="md:col-span-2 text-text-secondary-light dark:text-text-secondary-dark">
                   <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      className="w-full bg-transparent border border-gray-200 dark:border-gray-700 rounded p-2 focus:ring-1 focus:ring-primary focus:border-primary resize-none"
                      rows={3}
                      placeholder="Descripción del producto..."
                    />
                </div>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <span className="text-text-secondary-light dark:text-text-secondary-dark font-medium">Subtítulo</span>
                <div className="md:col-span-2 text-text-secondary-light dark:text-text-secondary-dark">
                    <input 
                        type="text" 
                        value={formData.subtitle}
                        onChange={(e) => handleInputChange("subtitle", e.target.value)}
                        className="w-full bg-transparent border-b border-transparent hover:border-gray-300 focus:border-primary focus:ring-0 px-0 py-1"
                        placeholder="-"
                    />
                </div>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <span className="text-text-secondary-light dark:text-text-secondary-dark font-medium">Manejo</span>
                <div className="md:col-span-2 text-text-secondary-light dark:text-text-secondary-dark font-mono text-xs flex items-center">
                    <span className="text-gray-400 mr-1">/</span>
                    <input 
                        type="text" 
                        value={formData.handle}
                        onChange={(e) => handleInputChange("handle", e.target.value)}
                        className="w-full bg-transparent border-b border-transparent hover:border-gray-300 focus:border-primary focus:ring-0 px-0 py-1"
                        placeholder="slug-producto"
                    />
                </div>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <span className="text-text-secondary-light dark:text-text-secondary-dark font-medium">Descontable</span>
                <div className="md:col-span-2 text-text-secondary-light dark:text-text-secondary-dark">
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                        type="checkbox"
                        checked={formData.discountApplicable}
                        onChange={(e) => handleInputChange("discountApplicable", e.target.checked)}
                        className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                        <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">{formData.discountApplicable ? "Sí" : "No"}</span>
                    </label>
                </div>
              </div>
            </div>
          </div>

          {/* Medios */}
          <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded shadow-sm p-6 bg-white dark:bg-[#1E1E1E]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Medios</h2>
              <button className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-xl">more_horiz</span>
              </button>
            </div>
            <div className="flex gap-4 flex-wrap">
              {/* Placeholder images based on code.html, would normally be formData.media */}
              <div className="relative group w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded border border-border-light dark:border-border-dark overflow-hidden flex items-center justify-center">
                <span className="material-symbols-outlined text-gray-400">image</span>
                <span className="absolute top-1 left-1 bg-blue-500 text-white rounded-full p-0.5">
                  <span className="material-symbols-outlined text-[10px] block">star</span>
                </span>
              </div>
              
              <div className="w-24 h-24 border-2 border-dashed border-border-light dark:border-border-dark rounded flex flex-col items-center justify-center text-text-secondary-light dark:text-text-secondary-dark hover:border-primary hover:text-primary transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-xl">add_photo_alternate</span>
                <span className="text-xs mt-1">Upload</span>
              </div>
            </div>
          </div>

          {/* Opciones */}
          <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded shadow-sm p-6 bg-white dark:bg-[#1E1E1E]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Opciones</h2>
              <button className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-xl">more_horiz</span>
              </button>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border-light dark:border-border-dark last:border-0">
              <span className="text-sm font-medium">Size</span>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs border border-border-light dark:border-border-dark font-mono">XL</span>
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs border border-border-light dark:border-border-dark font-mono">L</span>
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs border border-border-light dark:border-border-dark font-mono">M</span>
                <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs border border-border-light dark:border-border-dark font-mono">S</span>
                <button className="ml-2 text-text-secondary-light dark:text-text-secondary-dark hover:text-primary">
                  <span className="material-symbols-outlined text-lg">edit</span>
                </button>
              </div>
            </div>
          </div>

          {/* Variantes */}
          <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded shadow-sm overflow-hidden bg-white dark:bg-[#1E1E1E]">
            <div className="p-6 pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-lg font-semibold">Variantes</h2>
              <div className="flex items-center gap-2">
                <button className="p-2 text-text-secondary-light dark:text-text-secondary-dark border border-border-light dark:border-border-dark rounded hover:bg-gray-50 dark:hover:bg-gray-800">
                  <span className="material-symbols-outlined text-lg">filter_list</span>
                </button>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="material-symbols-outlined text-gray-400 text-lg">search</span>
                  </span>
                  <input className="pl-9 pr-4 py-1.5 text-sm bg-background-light dark:bg-black/30 border border-border-light dark:border-border-dark rounded focus:ring-1 focus:ring-primary focus:border-primary w-full md:w-48 placeholder-gray-500 text-text-primary-light dark:text-text-primary-dark" placeholder="Buscar" type="text"/>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-text-secondary-light dark:text-text-secondary-dark uppercase bg-background-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark">
                  <tr>
                    <th className="px-6 py-3 w-10" scope="col"></th>
                    <th className="px-6 py-3 font-medium" scope="col">Título</th>
                    <th className="px-6 py-3 font-medium" scope="col">SKU</th>
                    <th className="px-6 py-3 font-medium" scope="col">Inventario</th>
                    <th className="px-6 py-3 w-10" scope="col"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light dark:divide-border-dark">
                   {/* Example Variant Row */}
                   <tr className="bg-surface-light dark:bg-surface-dark hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-6 py-4">
                      <div className="w-8 h-8 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                        <span className="material-symbols-outlined text-sm">image</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium">Default Variant</td>
                    <td className="px-6 py-4 text-text-secondary-light dark:text-text-secondary-dark">-</td>
                    <td className="px-6 py-4 text-text-secondary-light dark:text-text-secondary-dark">0 disponible</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary">
                        <span className="material-symbols-outlined text-lg">more_horiz</span>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Metadata & JSON */}
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded shadow-sm p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors bg-white dark:bg-[#1E1E1E]">
                <div className="flex items-center gap-3">
                    <h2 className="font-semibold text-sm">Metadatos</h2>
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-xs rounded-full border border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark">0 claves</span>
                </div>
                <span className="material-symbols-outlined text-sm text-text-secondary-light dark:text-text-secondary-dark">open_in_new</span>
            </div>
            <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded shadow-sm p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors bg-white dark:bg-[#1E1E1E]">
                <div className="flex items-center gap-3">
                    <h2 className="font-semibold text-sm">JSON</h2>
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-xs rounded-full border border-border-light dark:border-border-dark text-text-secondary-light dark:text-text-secondary-dark">View</span>
                </div>
                <span className="material-symbols-outlined text-sm text-text-secondary-light dark:text-text-secondary-dark">open_in_new</span>
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Canales de venta */}
          <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded shadow-sm p-6 bg-white dark:bg-[#1E1E1E]">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-sm font-semibold">Canales de venta</h2>
              <button className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-lg">more_horiz</span>
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-text-secondary-light dark:text-text-secondary-dark">
                  <span className="material-symbols-outlined text-xs">share</span>
                </div>
                <span className="text-sm">Default Sales Channel</span>
              </div>
            </div>
          </div>

          {/* Organizar */}
          <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded shadow-sm bg-white dark:bg-[#1E1E1E]">
            <div className="p-6 pb-2 flex justify-between items-start">
              <h2 className="text-sm font-semibold">Organizar</h2>
              <button className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-lg">more_horiz</span>
              </button>
            </div>
            <div className="px-6 pb-6 space-y-4 text-sm">
              <div className="flex flex-col py-2 border-b border-border-light dark:border-border-dark border-dashed">
                <span className="text-text-secondary-light dark:text-text-secondary-dark mb-1">Tipo</span>
                <select
                    value={formData.type}
                    onChange={(e) => handleInputChange("type", e.target.value)}
                    className="w-full bg-transparent border border-gray-200 dark:border-gray-700 rounded p-1.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                >
                    <option value="">Seleccionar tipo</option>
                    {types.map((type) => (
                        <option key={type.id} value={type.id}>{type.valor}</option>
                    ))}
                </select>
              </div>
              <div className="flex flex-col py-2 border-b border-border-light dark:border-border-dark border-dashed">
                <span className="text-text-secondary-light dark:text-text-secondary-dark mb-1">Colección</span>
                 <select
                    value={formData.collection}
                    onChange={(e) => handleInputChange("collection", e.target.value)}
                    className="w-full bg-transparent border border-gray-200 dark:border-gray-700 rounded p-1.5 text-sm focus:ring-1 focus:ring-primary focus:border-primary"
                >
                    <option value="">Seleccionar colección</option>
                    {collections.map((collection) => (
                        <option key={collection.id} value={collection.id}>{collection.titulo}</option>
                    ))}
                </select>
              </div>
              <div className="flex flex-col py-2">
                <span className="text-text-secondary-light dark:text-text-secondary-dark mb-1">Categorías</span>
                <div className="flex flex-wrap gap-2">
                    {formData.categories.map((cat, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded border border-border-light dark:border-border-dark text-xs">{cat}</span>
                    ))}
                    <button className="text-xs text-primary hover:underline">+ Agregar</button>
                </div>
              </div>
            </div>
          </div>

          {/* Atributos (Mocked for now as per code.html structure but not in formData) */}
          <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded shadow-sm bg-white dark:bg-[#1E1E1E]">
            <div className="p-6 pb-2 flex justify-between items-start">
              <h2 className="text-sm font-semibold">Atributos</h2>
              <button className="text-text-secondary-light dark:text-text-secondary-dark hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-lg">more_horiz</span>
              </button>
            </div>
            <div className="px-6 pb-6 space-y-4 text-sm">
               <div className="flex justify-between items-center py-2 border-b border-border-light dark:border-border-dark border-dashed">
                <span className="text-text-secondary-light dark:text-text-secondary-dark">Peso</span>
                <span>-</span>
              </div>
              <div className="flex justify-between items-center py-2 pt-4">
                <span className="text-text-secondary-light dark:text-text-secondary-dark">País de origen</span>
                <span>-</span>
              </div>
            </div>
          </div>

        </div>
      </div>
      
       {saveError && (
        <div className="fixed bottom-4 right-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded shadow-lg z-50">
            {saveError}
        </div>
       )}
    </div>
  );
};

export default EditProductForm;
