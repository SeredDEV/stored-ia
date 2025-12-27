"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { categoryService } from "@/lib/api/categoryService";
import { tagService } from "@/lib/api/tagService";
import { collectionService } from "@/lib/api/collectionService";
import { typeService } from "@/lib/api/typeService";
import { productService } from "@/lib/api/productService";

interface ProductFormData {
  title: string;
  subtitle: string;
  handle: string;
  description: string;
  hasVariants: boolean;
  media: File[];
  options: ProductOption[];
  variants: ProductVariant[];
  // Organizar section
  discountApplicable: boolean;
  type: string;
  collection: string;
  categories: string[];
  tags: string[];
  shippingProfile: string;
  salesChannels: string[];
}

interface ProductOption {
  id: string;
  title: string;
  values: string[];
}

interface ProductVariant {
  id: string;
  name: string;
  selected: boolean;
  title?: string;
  sku?: string;
  managedInventory?: boolean;
  allowBackorder?: boolean;
  hasInventoryKit?: boolean;
  priceCOP?: string;
  priceCol?: string;
}

interface NewProductFormProps {
  onClose?: () => void;
  initialData?: Partial<ProductFormData>;
}

const NewProductForm: React.FC<NewProductFormProps> = ({
  onClose,
  initialData,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab =
    (searchParams.get("tab") as "details" | "organize" | "variants") ||
    "details";

  const setActiveTab = (tab: "details" | "organize" | "variants") => {
    // Si cambiamos a la pestaña de variantes y no hay variantes creadas (ni opción de variantes activada),
    // creamos una variante por defecto basada en el título del producto
    if (
      tab === "variants" &&
      !formData.hasVariants &&
      formData.variants.length === 0 &&
      formData.title
    ) {
      // Generar SKU automático
      const baseSku = formData.handle.toUpperCase().slice(0, 10);
      const skuSuffix = Math.random()
        .toString(36)
        .substring(2, 6)
        .toUpperCase();
      const autoSku = `${baseSku}-${skuSuffix}`;

      setFormData((prev) => ({
        ...prev,
        variants: [
          {
            id: "default-variant",
            name: prev.title, // Usamos el título del producto
            selected: true,
            title: prev.title, // Usamos el título del producto
            sku: autoSku,
            priceCOP: "",
            managedInventory: false,
            allowBackorder: false,
            hasInventoryKit: false,
          },
        ],
      }));
    }

    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.push(`?${params.toString()}`);
  };

  // Función para manejar el cierre del formulario
  const handleClose = () => {
    // Solo preguntar si hay datos ingresados
    if (formData.title || formData.description || formData.handle) {
      const confirmar = window.confirm(
        "¿Deseas descartar los cambios? Se perderá el borrador guardado."
      );
      if (confirmar) {
        clearLocalStorage();
        if (onClose) {
          onClose();
        } else {
          router.push("/dashboard?view=products");
        }
      }
    } else {
      clearLocalStorage();
      if (onClose) {
        onClose();
      } else {
        router.push("/dashboard?view=products");
      }
    }
  };

  const activeTab = currentTab;

  const STORAGE_KEY = "product-form-draft";

  const [formData, setFormData] = useState<ProductFormData>({
    title: initialData?.title || "",
    subtitle: initialData?.subtitle || "",
    handle: initialData?.handle || "",
    description: initialData?.description || "",
    hasVariants: initialData?.hasVariants || false,
    media: initialData?.media || [],
    options: initialData?.options || [],
    variants: initialData?.variants || [],
    discountApplicable: initialData?.discountApplicable || false,
    type: initialData?.type || "",
    collection: initialData?.collection || "",
    categories: initialData?.categories || [],
    tags: initialData?.tags || [],
    shippingProfile: initialData?.shippingProfile || "",
    salesChannels: initialData?.salesChannels || ["Default Sales Channel"],
  });

  const [mounted, setMounted] = useState(false);

  // Cargar desde localStorage después del montaje
  useEffect(() => {
    setMounted(true);

    if (!initialData && typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          // No cargamos las imágenes (media) desde localStorage ya que son archivos
          setFormData({ ...parsed, media: [] });
        }
      } catch (error) {
        console.error("Error al cargar borrador:", error);
      }
    }
  }, [initialData]);

  // Estados para dropdowns abiertos
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Guardar automáticamente en localStorage cuando cambie formData
  useEffect(() => {
    if (!mounted || typeof window === "undefined") return;

    // Solo guardar si hay algún dato ingresado
    if (formData.title || formData.description || formData.handle) {
      try {
        // No guardamos las imágenes (media) en localStorage
        const dataToSave = { ...formData, media: [] };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      } catch (error) {
        console.error("Error al guardar borrador:", error);
      }
    }
  }, [formData]);

  // Limpiar localStorage al guardar exitosamente
  const clearLocalStorage = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  // Estados para las listas de organizar
  const [categories, setCategories] = useState<any[]>([]);
  const [tags, setTags] = useState<any[]>([]);
  const [collections, setCollections] = useState<any[]>([]);
  const [types, setTypes] = useState<any[]>([]);
  const [loadingOrganizeData, setLoadingOrganizeData] = useState(false);
  const [showNewTypeInput, setShowNewTypeInput] = useState(false);
  const [newTypeName, setNewTypeName] = useState("");
  const [creatingType, setCreatingType] = useState(false);

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

  // Función para crear un nuevo tipo
  const handleCreateType = async () => {
    if (!newTypeName.trim()) return;

    setCreatingType(true);
    try {
      const newType = await typeService.create({
        valor: newTypeName.trim(),
      });

      setTypes([...types, newType]);
      handleInputChange("type", newType.id);
      setNewTypeName("");
      setShowNewTypeInput(false);
    } catch (error) {
      console.error("Error al crear tipo:", error);
    } finally {
      setCreatingType(false);
    }
  };

  // Helper para producto cartesiano
  const cartesian = (arrays: string[][]): string[][] => {
    return arrays.reduce<string[][]>(
      (acc, curr) => {
        return acc.flatMap((x) => curr.map((y) => [...x, y]));
      },
      [[]]
    );
  };

  // Función para generar variantes basadas en las opciones (Producto Cartesiano)
  const generateVariants = (options: ProductOption[]): ProductVariant[] => {
    // Solo consideramos opciones que tengan valores
    const validOptions = options.filter(
      (opt) => opt.values && opt.values.length > 0
    );

    if (validOptions.length === 0) return [];

    const valuesArrays = validOptions.map((opt) => opt.values);
    const combinations = cartesian(valuesArrays);

    return combinations.map((combo, idx) => {
      const name = combo.join(" / ");
      // Generamos un ID basado en la combinación para intentar mantenerlo estable
      const safeId = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

      // Generar SKU automático para cada variante
      const baseHandle = formData.handle || "product";
      const variantCode = safeId.slice(0, 8).toUpperCase();
      const skuSuffix = Math.random()
        .toString(36)
        .substring(2, 4)
        .toUpperCase();
      const autoSku = `${baseHandle
        .toUpperCase()
        .slice(0, 8)}-${variantCode}-${skuSuffix}`;

      return {
        id: `variant-${safeId}-${idx}`,
        name: name,
        selected: true,
        title: name, // El título por defecto es la combinación
        sku: autoSku,
        managedInventory: false,
        allowBackorder: false,
        hasInventoryKit: false,
        priceCOP: "",
      };
    });
  };

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData((prev) => {
      const updated: ProductFormData = { ...prev, [field]: value };

      // Auto-generar handle desde el título con timestamp para hacerlo único
      if (field === "title" && typeof value === "string") {
        const baseHandle = value
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");

        // Agregar timestamp corto para garantizar unicidad
        const timestamp = Date.now().toString().slice(-6);
        updated.handle = `${baseHandle}-${timestamp}`;
      }

      // Generar variantes cuando se activa el toggle de variantes
      if (field === "hasVariants") {
        if (value === true) {
          // Si activamos variantes, generamos basadas en opciones si existen,
          // o limpiamos la variante por defecto para que el usuario cree opciones
          if (updated.options.length > 0) {
            updated.variants = generateVariants(updated.options);
          } else {
            updated.variants = [];
          }
        } else {
          // Si desactivamos variantes, volvemos a la variante por defecto única con SKU
          const baseSku = updated.handle.toUpperCase().slice(0, 10);
          const skuSuffix = Math.random()
            .toString(36)
            .substring(2, 6)
            .toUpperCase();
          const autoSku = `${baseSku}-${skuSuffix}`;

          updated.variants = [
            {
              id: "default-variant",
              name: updated.title || "Default Variant",
              selected: true,
              title: updated.title || "Default Variant",
              sku: autoSku,
              priceCOP: "",
              managedInventory: false,
              allowBackorder: false,
              hasInventoryKit: false,
            },
          ];
        }
      }

      return updated;
    });
  };

  const handleAddOption = () => {
    const newOption: ProductOption = {
      id: Date.now().toString(),
      title: "",
      values: [],
    };
    setFormData((prev) => ({
      ...prev,
      options: [...prev.options, newOption],
    }));
  };

  const handleRemoveOption = (optionId: string) => {
    setFormData((prev) => {
      const updatedOptions = prev.options.filter((opt) => opt.id !== optionId);
      const variants =
        prev.hasVariants && updatedOptions.length > 0
          ? generateVariants(updatedOptions)
          : [];

      return {
        ...prev,
        options: updatedOptions,
        variants,
      };
    });
  };

  const handleOptionChange = (
    optionId: string,
    field: "title" | "values",
    value: any
  ) => {
    setFormData((prev) => {
      const updatedOptions = prev.options.map((opt) =>
        opt.id === optionId ? { ...opt, [field]: value } : opt
      );

      // Regenerar variantes cuando cambian las opciones
      const variants =
        prev.hasVariants && updatedOptions.length > 0
          ? generateVariants(updatedOptions)
          : prev.variants;

      return {
        ...prev,
        options: updatedOptions,
        variants,
      };
    });
  };

  const handleAddOptionValue = (optionId: string, value: string) => {
    setFormData((prev) => {
      const updatedOptions = prev.options.map((opt) =>
        opt.id === optionId ? { ...opt, values: [...opt.values, value] } : opt
      );

      // Regenerar variantes cuando se agrega un valor
      const variants =
        prev.hasVariants && updatedOptions.length > 0
          ? generateVariants(updatedOptions)
          : prev.variants;

      return {
        ...prev,
        options: updatedOptions,
        variants,
      };
    });
  };

  const handleRemoveOptionValue = (optionId: string, valueIndex: number) => {
    setFormData((prev) => {
      const updatedOptions = prev.options.map((opt) =>
        opt.id === optionId
          ? {
              ...opt,
              values: opt.values.filter((_, idx) => idx !== valueIndex),
            }
          : opt
      );

      // Regenerar variantes cuando se elimina un valor
      const variants =
        prev.hasVariants && updatedOptions.length > 0
          ? generateVariants(updatedOptions)
          : prev.variants;

      return {
        ...prev,
        options: updatedOptions,
        variants,
      };
    });
  };

  const handleMediaUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      setFormData((prev) => ({
        ...prev,
        media: [...prev.media, ...newFiles],
      }));
    }
  };

  const handleRemoveMedia = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      media: prev.media.filter((_, idx) => idx !== index),
    }));
  };

  const handleSaveProduct = async (isDraft: boolean = false) => {
    try {
      setIsSaving(true);
      setSaveError(null);

      console.log("=== Iniciando guardado de producto ===");
      console.log("isDraft:", isDraft);
      console.log("formData:", formData);

      // Validar que tenga título
      if (!formData.title || formData.title.trim() === "") {
        throw new Error("El título es requerido");
      }

      // Crear FormData para enviar imágenes
      const data = new FormData();

      // Agregar datos básicos del producto
      data.append("titulo", formData.title.trim());
      data.append("subtitulo", formData.subtitle?.trim() || "");
      data.append("slug", formData.handle.trim());
      data.append("descripcion", formData.description?.trim() || "");
      data.append("tiene_descuento", formData.discountApplicable.toString());
      data.append("tiene_variantes", formData.hasVariants.toString());
      data.append("estado", isDraft ? "borrador" : "publicado");

      console.log("Datos básicos agregados");

      // Agregar tipo si existe
      if (formData.type) {
        data.append("tipo_producto_id", formData.type);
        console.log("Tipo agregado:", formData.type);
      }

      // Agregar colección si existe
      if (formData.collection) {
        data.append("coleccion_id", formData.collection);
        console.log("Colección agregada:", formData.collection);
      }

      // Agregar categorías
      if (formData.categories.length > 0) {
        data.append("categorias", JSON.stringify(formData.categories));
        console.log("Categorías agregadas:", formData.categories);
      }

      // Agregar etiquetas
      if (formData.tags.length > 0) {
        data.append("etiquetas", JSON.stringify(formData.tags));
        console.log("Etiquetas agregadas:", formData.tags);
      }

      // Agregar imágenes
      if (formData.media.length > 0) {
        // La primera imagen será la miniatura
        data.append("miniatura", formData.media[0]);
        console.log("Miniatura agregada:", formData.media[0].name);

        // Todas las imágenes van a imagenes
        formData.media.forEach((file, index) => {
          data.append("imagenes", file);
          console.log(`Imagen ${index + 1} agregada:`, file.name);
        });
      } else {
        console.log("No hay imágenes para agregar");
      }

      // Agregar variantes si existen
      if (formData.variants.length > 0) {
        const variantesSanitizadas = formData.variants
          .filter((v) => v.selected && !v.id.startsWith("option-"))
          .map((v) => ({
            titulo: v.title || v.name,
            sku: v.sku || "",
            inventario_gestionado: v.managedInventory || false,
            permitir_pedido_sin_inventario: v.allowBackorder || false,
            precio_cop: v.priceCOP ? parseFloat(v.priceCOP) : 0,
          }));

        if (variantesSanitizadas.length > 0) {
          data.append("variantes", JSON.stringify(variantesSanitizadas));
          console.log("Variantes agregadas:", variantesSanitizadas);
        }
      }

      // Enviar al backend
      console.log("=== Enviando al backend ===");
      console.log("URL:", "/api/productos");

      const producto = await productService.createWithImages(data);

      console.log("=== Producto creado exitosamente ===");
      console.log("Producto:", producto);

      // Limpiar localStorage después de guardar exitosamente
      clearLocalStorage();

      // Redirigir al listado de productos
      if (onClose) {
        onClose();
      } else {
        router.push("/dashboard?view=products");
      }
    } catch (error: any) {
      console.error("=== ERROR al guardar producto ===");
      console.error("Error completo:", error);
      console.error("Mensaje:", error.message);
      console.error("Stack:", error.stack);

      setSaveError(error.message || "Error al guardar el producto");
    } finally {
      setIsSaving(false);
      console.log("=== Finalizando guardado ===");
    }
  };

  return (
    <div className="w-[calc(100%+2rem)] -m-4 md:w-full md:m-0">
      <div className="bg-white dark:bg-surface-dark w-full rounded-none md:rounded-xl shadow-sm border-y md:border border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Header con tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 px-3 md:px-6 flex items-center justify-between gap-3 bg-white dark:bg-surface-dark rounded-none md:rounded-t-xl sticky top-0 z-30">
          <div className="flex flex-1 items-center min-w-0">
            <div className="flex flex-1 md:flex-none justify-between md:justify-start gap-0 md:gap-6 w-full md:w-auto">
              <button
                onClick={() => setActiveTab("details")}
                className={`relative flex-1 md:flex-none px-2 md:px-3 py-4 text-sm font-medium whitespace-nowrap text-center transition-colors flex items-center justify-center gap-2 ${
                  activeTab === "details"
                    ? "text-echo-blue dark:text-primary"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  description
                </span>
                Detalles
                {activeTab === "details" && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-echo-blue dark:bg-primary rounded-t-full" />
                )}
              </button>

              <button
                onClick={() => setActiveTab("organize")}
                className={`relative flex-1 md:flex-none px-2 md:px-3 py-4 text-sm font-medium whitespace-nowrap text-center transition-colors flex items-center justify-center gap-2 ${
                  activeTab === "organize"
                    ? "text-echo-blue dark:text-primary"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  category
                </span>
                Organizar
                {activeTab === "organize" && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-echo-blue dark:bg-primary rounded-t-full" />
                )}
              </button>

              <button
                onClick={() => setActiveTab("variants")}
                className={`relative flex-1 md:flex-none px-2 md:px-3 py-4 text-sm font-medium whitespace-nowrap text-center transition-colors flex items-center justify-center gap-2 ${
                  activeTab === "variants"
                    ? "text-echo-blue dark:text-primary"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  style
                </span>
                Variantes
                {activeTab === "variants" && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-echo-blue dark:bg-primary rounded-t-full" />
                )}
              </button>
            </div>
          </div>

          {/* Mensaje de borrador guardado */}
          {mounted && formData.title && (
            <div className="hidden md:flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="material-symbols-outlined text-base">save</span>
              <span>Borrador guardado automáticamente</span>
            </div>
          )}

          <button
            onClick={handleClose}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            title="Cerrar formulario"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6">
          {activeTab === "details" && (
            <div className="space-y-6">
              {/* General Section */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  General
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center gap-1 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Título
                        <span
                          className="text-red-500 text-lg leading-none"
                          title="Obligatorio"
                        >
                          *
                        </span>
                      </label>
                      <div className="relative group">
                        <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#9CA3AF] dark:text-gray-400 transition-colors text-[20px]">
                          title
                        </span>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) =>
                            handleInputChange("title", e.target.value)
                          }
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-echo-blue dark:focus:ring-primary focus:border-transparent"
                          placeholder="Ej: Chaqueta de invierno"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Subtítulo
                      </label>
                      <div className="relative group">
                        <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#9CA3AF] group-focus-within:text-gray-700 dark:text-gray-400 dark:group-focus-within:text-gray-200 transition-colors text-[20px]">
                          subtitles
                        </span>
                        <input
                          type="text"
                          value={formData.subtitle}
                          onChange={(e) =>
                            handleInputChange("subtitle", e.target.value)
                          }
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-echo-blue dark:focus:ring-primary focus:border-transparent"
                          placeholder="Ej: Cálido y acogedor"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Manejo
                      <span
                        className="material-symbols-outlined text-[#9CA3AF] text-sm cursor-help"
                        title="URL amigable para el producto"
                      >
                        info
                      </span>
                    </label>
                    <div className="relative group">
                      <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#9CA3AF] dark:text-gray-400 transition-colors text-[20px]">
                        link
                      </span>
                      <span className="absolute left-10 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                        /
                      </span>
                      <input
                        type="text"
                        value={formData.handle}
                        onChange={(e) =>
                          handleInputChange("handle", e.target.value)
                        }
                        className="w-full pl-14 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-echo-blue dark:focus:ring-primary focus:border-transparent"
                        placeholder="chaqueta-de-invierno"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Descripción
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      rows={4}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-echo-blue dark:focus:ring-primary focus:border-transparent resize-none"
                      placeholder="Una chaqueta cálida y acogedora..."
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Imágenes del producto
                    </label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-10 text-center hover:border-echo-blue dark:hover:border-primary transition-all bg-gray-50 dark:bg-gray-800/50 group">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleMediaUpload(e.target.files)}
                        className="hidden"
                        id="media-upload"
                      />
                      <label
                        htmlFor="media-upload"
                        className="cursor-pointer flex flex-col items-center gap-4"
                      >
                        <div className="w-16 h-16 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                          <span className="material-symbols-outlined text-3xl text-echo-blue dark:text-primary">
                            cloud_upload
                          </span>
                        </div>
                        <div>
                          <div className="text-gray-900 dark:text-white font-medium mb-1 text-base">
                            Haz clic para subir imágenes
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            o arrastra y suelta aquí
                          </div>
                          <div className="text-xs text-gray-400 mt-2">
                            PNG, JPG, WEBP hasta 5MB
                          </div>
                        </div>
                      </label>
                    </div>
                    {formData.media.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {formData.media.map((file, index) => (
                          <div
                            key={index}
                            className="relative group border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden aspect-square"
                          >
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button
                                onClick={() => handleRemoveMedia(index)}
                                className="bg-white/90 text-red-600 rounded-full p-2 hover:bg-white hover:scale-110 transition-all shadow-lg"
                                title="Eliminar imagen"
                              >
                                <span className="material-symbols-outlined text-xl">
                                  delete
                                </span>
                              </button>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                              <p className="text-xs text-white truncate px-1">
                                {file.name}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Sección de Variantes */}
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Variantes
                    </h3>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.hasVariants}
                              onChange={(e) =>
                                handleInputChange(
                                  "hasVariants",
                                  e.target.checked
                                )
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-echo-blue dark:peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-echo-blue dark:peer-checked:bg-primary"></div>
                          </label>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Sí, este es un producto con variantes
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Si no está marcado, crearemos una variante
                        predeterminada para ti
                      </p>

                      {formData.hasVariants && (
                        <>
                          <div>
                            <div className="flex items-center justify-between mb-4">
                              <div>
                                <h4 className="text-base font-medium text-gray-900 dark:text-white mb-1">
                                  Opciones de producto
                                </h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Define las opciones del producto, por ejemplo,
                                  color, tamaño, etc.
                                </p>
                              </div>
                              <button
                                onClick={handleAddOption}
                                className="px-4 py-2 bg-echo-blue dark:bg-primary text-white rounded-lg hover:bg-echo-blue-variant dark:hover:bg-blue-700 transition-colors text-sm font-medium"
                              >
                                Agregar
                              </button>
                            </div>

                            <div className="space-y-4">
                              {formData.options.map((option) => (
                                <div
                                  key={option.id}
                                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                                >
                                  <div className="flex items-center gap-4 mb-4">
                                    <div className="relative flex-1">
                                      <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#9CA3AF] group-focus-within:text-gray-700 dark:text-gray-400 dark:group-focus-within:text-gray-200 transition-colors text-[20px]">
                                        title
                                      </span>
                                      <input
                                        type="text"
                                        value={option.title}
                                        onChange={(e) =>
                                          handleOptionChange(
                                            option.id,
                                            "title",
                                            e.target.value
                                          )
                                        }
                                        placeholder="Título (ej: Color)"
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-echo-blue dark:focus:ring-primary focus:border-transparent"
                                      />
                                    </div>
                                    <button
                                      onClick={() =>
                                        handleRemoveOption(option.id)
                                      }
                                      className="text-red-500 hover:text-red-700 transition-colors"
                                    >
                                      <span className="material-symbols-outlined">
                                        delete
                                      </span>
                                    </button>
                                  </div>
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                      Valores
                                    </label>
                                    <div className="relative w-full border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus-within:ring-2 focus-within:ring-echo-blue dark:focus-within:ring-primary focus-within:border-transparent">
                                      <div className="flex flex-wrap items-center gap-2 p-2">
                                        <span className="material-symbols-outlined text-[#9CA3AF] text-[20px] ml-1">
                                          label
                                        </span>
                                        {option.values.map((value, idx) => (
                                          <span
                                            key={idx}
                                            className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-sm"
                                          >
                                            {value}
                                            <button
                                              type="button"
                                              onClick={() =>
                                                handleRemoveOptionValue(
                                                  option.id,
                                                  idx
                                                )
                                              }
                                              className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 ml-1"
                                            >
                                              <span className="material-symbols-outlined text-sm">
                                                close
                                              </span>
                                            </button>
                                          </span>
                                        ))}
                                        <input
                                          type="text"
                                          className="flex-1 min-w-[120px] bg-transparent border-0 outline-none text-gray-900 dark:text-white px-2 py-1"
                                          placeholder={
                                            option.values.length === 0
                                              ? "Ej: Rojo, Verde, Azul"
                                              : ""
                                          }
                                          onKeyDown={(e) => {
                                            const input = e.currentTarget;
                                            if (
                                              e.key === "," ||
                                              e.key === "Enter"
                                            ) {
                                              e.preventDefault();
                                              const value = input.value.trim();
                                              if (value) {
                                                handleAddOptionValue(
                                                  option.id,
                                                  value
                                                );
                                                input.value = "";
                                              }
                                            } else if (
                                              e.key === "Backspace" &&
                                              input.value === "" &&
                                              option.values.length > 0
                                            ) {
                                              handleRemoveOptionValue(
                                                option.id,
                                                option.values.length - 1
                                              );
                                            }
                                          }}
                                          onBlur={(e) => {
                                            const value =
                                              e.currentTarget.value.trim();
                                            if (value) {
                                              handleAddOptionValue(
                                                option.id,
                                                value
                                              );
                                              e.currentTarget.value = "";
                                            }
                                          }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {formData.variants.length > 0 && (
                            <div>
                              <div className="mb-4">
                                <h4 className="text-base font-medium text-gray-900 dark:text-white mb-1">
                                  Variantes de producto
                                </h4>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Este orden afectará el orden de las variantes
                                  en tu tienda.
                                </p>
                              </div>
                              <div className="space-y-2">
                                {formData.variants.map((variant, index) => {
                                  // El primer elemento de cada opción (el título) no tiene icono de drag
                                  const isOptionTitle =
                                    variant.id.startsWith("option-");
                                  return (
                                    <div
                                      key={variant.id}
                                      className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
                                    >
                                      {!isOptionTitle && (
                                        <span className="material-symbols-outlined text-gray-400 cursor-move">
                                          drag_indicator
                                        </span>
                                      )}
                                      {isOptionTitle && (
                                        <div className="w-6"></div>
                                      )}
                                      <input
                                        type="checkbox"
                                        checked={variant.selected}
                                        onChange={(e) => {
                                          setFormData((prev) => ({
                                            ...prev,
                                            variants: prev.variants.map((v) =>
                                              v.id === variant.id
                                                ? {
                                                    ...v,
                                                    selected: e.target.checked,
                                                  }
                                                : v
                                            ),
                                          }));
                                        }}
                                        className="w-4 h-4 text-echo-blue dark:text-primary border-gray-300 rounded focus:ring-2 focus:ring-echo-blue dark:focus:ring-primary"
                                      />
                                      <span className="text-sm text-gray-700 dark:text-gray-300">
                                        {variant.name}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                  Consejo:
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  Las variantes sin marcar no serán creadas.
                                  Siempre puedes crear y editar variantes
                                  después, pero esta lista se adapta a las
                                  variaciones en tus opciones de producto.
                                </p>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "variants" && (
            <div className="w-full">
              <div className="bg-white dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="max-h-[500px] overflow-y-auto">
                  {formData.variants.filter((v) => !v.id.startsWith("option-"))
                    .length === 0 ? (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-surface-dark">
                      <span className="material-symbols-outlined text-4xl mb-2 block mx-auto opacity-50">
                        inventory_2
                      </span>
                      <p>No hay variantes generadas.</p>
                      <p className="text-sm mt-1">
                        Agrega opciones en la pestaña "Detalles" para generar
                        variantes.
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Vista Desktop (Tabla) */}
                      <div className="hidden md:block overflow-x-auto">
                        <table className="w-full relative">
                          <thead className="sticky top-0 z-10 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
                            <tr>
                              <th className="px-2 py-3 text-left w-16 bg-gray-50 dark:bg-gray-800">
                                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                                  Acciones
                                </span>
                              </th>
                              <th className="px-2 py-3 text-left bg-gray-50 dark:bg-gray-800">
                                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                                  Variantes
                                </span>
                              </th>
                              <th className="px-2 py-3 text-left bg-gray-50 dark:bg-gray-800">
                                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                                  Título
                                </span>
                              </th>
                              <th className="px-2 py-3 text-left bg-gray-50 dark:bg-gray-800">
                                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                                  SKU
                                </span>
                              </th>
                              <th className="px-2 py-3 text-center w-24 bg-gray-50 dark:bg-gray-800">
                                <span
                                  className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase block"
                                  title="Inventario Gestionado"
                                >
                                  Inv. Gest.
                                </span>
                              </th>
                              <th className="px-2 py-3 text-center w-28 bg-gray-50 dark:bg-gray-800">
                                <span
                                  className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase block"
                                  title="Pedido Pendiente"
                                >
                                  Ped. Pend.
                                </span>
                              </th>
                              <th className="px-2 py-3 text-center w-24 bg-gray-50 dark:bg-gray-800">
                                <span
                                  className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase block"
                                  title="Kit Inventario"
                                >
                                  Kit Inv.
                                </span>
                              </th>
                              <th className="px-2 py-3 text-left w-32 bg-gray-50 dark:bg-gray-800">
                                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
                                  Precio COP
                                </span>
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {formData.variants
                              .filter((v) => !v.id.startsWith("option-"))
                              .map((variant) => (
                                <tr
                                  key={variant.id}
                                  className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors bg-white dark:bg-surface-dark group"
                                >
                                  <td className="px-2 py-3">
                                    <div className="flex items-center justify-center gap-1">
                                      <button
                                        className="text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                        title="Ver detalles"
                                      >
                                        <span className="material-symbols-outlined text-base">
                                          visibility
                                        </span>
                                      </button>
                                      <button
                                        onClick={() => {
                                          setFormData((prev) => ({
                                            ...prev,
                                            variants: prev.variants.filter(
                                              (v) => v.id !== variant.id
                                            ),
                                          }));
                                        }}
                                        className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                                        title="Eliminar variante"
                                      >
                                        <span className="material-symbols-outlined text-base">
                                          delete
                                        </span>
                                      </button>
                                    </div>
                                  </td>
                                  <td className="px-2 py-3">
                                    <input
                                      type="text"
                                      value={
                                        variant.id.startsWith("default-variant")
                                          ? ""
                                          : variant.name
                                      }
                                      disabled={variant.id.startsWith(
                                        "default-variant"
                                      )}
                                      onChange={(e) => {
                                        setFormData((prev) => ({
                                          ...prev,
                                          variants: prev.variants.map((v) =>
                                            v.id === variant.id
                                              ? { ...v, name: e.target.value }
                                              : v
                                          ),
                                        }));
                                      }}
                                      className={`w-full px-2.5 py-1.5 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-echo-blue dark:focus:ring-primary focus:border-transparent transition-all ${
                                        variant.id.startsWith("default-variant")
                                          ? "bg-gray-100 dark:bg-gray-700 text-gray-400"
                                          : ""
                                      }`}
                                      placeholder={
                                        variant.id.startsWith("default-variant")
                                          ? "-"
                                          : ""
                                      }
                                    />
                                  </td>
                                  <td className="px-2 py-3">
                                    <input
                                      type="text"
                                      value={variant.title || variant.name}
                                      onChange={(e) => {
                                        setFormData((prev) => ({
                                          ...prev,
                                          variants: prev.variants.map((v) =>
                                            v.id === variant.id
                                              ? { ...v, title: e.target.value }
                                              : v
                                          ),
                                        }));
                                      }}
                                      className="w-full px-2.5 py-1.5 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-echo-blue dark:focus:ring-primary focus:border-transparent transition-all"
                                    />
                                  </td>
                                  <td className="px-2 py-3">
                                    <input
                                      type="text"
                                      value={variant.sku || ""}
                                      onChange={(e) => {
                                        setFormData((prev) => ({
                                          ...prev,
                                          variants: prev.variants.map((v) =>
                                            v.id === variant.id
                                              ? { ...v, sku: e.target.value }
                                              : v
                                          ),
                                        }));
                                      }}
                                      className="w-full px-2.5 py-1.5 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-echo-blue dark:focus:ring-primary focus:border-transparent transition-all"
                                      placeholder="SKU"
                                    />
                                  </td>
                                  <td className="px-2 py-3">
                                    <div className="flex items-center justify-center">
                                      <input
                                        type="checkbox"
                                        checked={
                                          variant.managedInventory || false
                                        }
                                        onChange={(e) => {
                                          setFormData((prev) => ({
                                            ...prev,
                                            variants: prev.variants.map((v) =>
                                              v.id === variant.id
                                                ? {
                                                    ...v,
                                                    managedInventory:
                                                      e.target.checked,
                                                  }
                                                : v
                                            ),
                                          }));
                                        }}
                                        className="w-4 h-4 text-echo-blue dark:text-primary border-gray-300 rounded focus:ring-2 focus:ring-echo-blue dark:focus:ring-primary cursor-pointer"
                                      />
                                    </div>
                                  </td>
                                  <td className="px-2 py-3">
                                    <div className="flex items-center justify-center">
                                      <input
                                        type="checkbox"
                                        checked={
                                          variant.allowBackorder || false
                                        }
                                        onChange={(e) => {
                                          setFormData((prev) => ({
                                            ...prev,
                                            variants: prev.variants.map((v) =>
                                              v.id === variant.id
                                                ? {
                                                    ...v,
                                                    allowBackorder:
                                                      e.target.checked,
                                                  }
                                                : v
                                            ),
                                          }));
                                        }}
                                        className="w-4 h-4 text-echo-blue dark:text-primary border-gray-300 rounded focus:ring-2 focus:ring-echo-blue dark:focus:ring-primary cursor-pointer"
                                      />
                                    </div>
                                  </td>
                                  <td className="px-2 py-3">
                                    <div className="flex items-center justify-center">
                                      <input
                                        type="checkbox"
                                        checked={
                                          variant.hasInventoryKit || false
                                        }
                                        onChange={(e) => {
                                          setFormData((prev) => ({
                                            ...prev,
                                            variants: prev.variants.map((v) =>
                                              v.id === variant.id
                                                ? {
                                                    ...v,
                                                    hasInventoryKit:
                                                      e.target.checked,
                                                  }
                                                : v
                                            ),
                                          }));
                                        }}
                                        className="w-4 h-4 text-echo-blue dark:text-primary border-gray-300 rounded focus:ring-2 focus:ring-echo-blue dark:focus:ring-primary cursor-pointer"
                                      />
                                    </div>
                                  </td>
                                  <td className="px-2 py-3">
                                    <div className="flex items-center gap-1">
                                      <span className="text-gray-600 dark:text-gray-400 font-medium text-sm">
                                        $
                                      </span>
                                      <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={variant.priceCOP || ""}
                                        onChange={(e) => {
                                          setFormData((prev) => ({
                                            ...prev,
                                            variants: prev.variants.map((v) =>
                                              v.id === variant.id
                                                ? {
                                                    ...v,
                                                    priceCOP: e.target.value,
                                                  }
                                                : v
                                            ),
                                          }));
                                        }}
                                        className="flex-1 px-2.5 py-1.5 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-echo-blue dark:focus:ring-primary focus:border-transparent transition-all"
                                        placeholder="0.00"
                                      />
                                    </div>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Vista Móvil (Tarjetas) */}
                      <div className="md:hidden space-y-4 p-4">
                        {formData.variants
                          .filter((v) => !v.id.startsWith("option-"))
                          .map((variant) => (
                            <div
                              key={variant.id}
                              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium text-gray-900 dark:text-white">
                                    {variant.name}
                                  </h4>
                                  <input
                                    type="text"
                                    value={variant.sku || ""}
                                    onChange={(e) => {
                                      setFormData((prev) => ({
                                        ...prev,
                                        variants: prev.variants.map((v) =>
                                          v.id === variant.id
                                            ? { ...v, sku: e.target.value }
                                            : v
                                        ),
                                      }));
                                    }}
                                    className="mt-1 w-full px-2 py-1 text-xs border border-gray-200 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-900/50"
                                    placeholder="SKU"
                                  />
                                </div>
                                <button
                                  onClick={() => {
                                    setFormData((prev) => ({
                                      ...prev,
                                      variants: prev.variants.filter(
                                        (v) => v.id !== variant.id
                                      ),
                                    }));
                                  }}
                                  className="text-gray-400 hover:text-red-500"
                                >
                                  <span className="material-symbols-outlined">
                                    delete
                                  </span>
                                </button>
                              </div>

                              <div className="flex gap-2">
                                <div className="flex-1">
                                  <label className="text-xs text-gray-500 block mb-1">
                                    Precio
                                  </label>
                                  <div className="flex items-center gap-1">
                                    <span className="text-gray-500 text-xs">
                                      $
                                    </span>
                                    <input
                                      type="number"
                                      value={variant.priceCOP || ""}
                                      onChange={(e) => {
                                        setFormData((prev) => ({
                                          ...prev,
                                          variants: prev.variants.map((v) =>
                                            v.id === variant.id
                                              ? {
                                                  ...v,
                                                  priceCOP: e.target.value,
                                                }
                                              : v
                                          ),
                                        }));
                                      }}
                                      className="w-full px-2 py-1 text-sm border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-900"
                                      placeholder="0.00"
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="flex justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                                <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                  <input
                                    type="checkbox"
                                    checked={variant.managedInventory || false}
                                    onChange={(e) => {
                                      setFormData((prev) => ({
                                        ...prev,
                                        variants: prev.variants.map((v) =>
                                          v.id === variant.id
                                            ? {
                                                ...v,
                                                managedInventory:
                                                  e.target.checked,
                                              }
                                            : v
                                        ),
                                      }));
                                    }}
                                    className="rounded border-gray-300 text-echo-blue focus:ring-echo-blue"
                                  />
                                  Inventario
                                </label>
                                <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                  <input
                                    type="checkbox"
                                    checked={variant.allowBackorder || false}
                                    onChange={(e) => {
                                      setFormData((prev) => ({
                                        ...prev,
                                        variants: prev.variants.map((v) =>
                                          v.id === variant.id
                                            ? {
                                                ...v,
                                                allowBackorder:
                                                  e.target.checked,
                                              }
                                            : v
                                        ),
                                      }));
                                    }}
                                    className="rounded border-gray-300 text-echo-blue focus:ring-echo-blue"
                                  />
                                  Preventa
                                </label>
                              </div>
                            </div>
                          ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "organize" && (
            <div className="space-y-6">
              {/* Tarjeta de Clasificación */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-echo-blue dark:text-primary">
                    category
                  </span>
                  Clasificación
                </h3>

                <div className="space-y-6">
                  {/* Descuento aplicable */}
                  <div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center gap-3">
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.discountApplicable}
                            onChange={(e) =>
                              handleInputChange(
                                "discountApplicable",
                                e.target.checked
                              )
                            }
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-echo-blue dark:peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-echo-blue dark:peer-checked:bg-primary"></div>
                        </label>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Descuento aplicable
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Si no está marcado, no se aplicarán descuentos a este
                      producto
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Tipo */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Tipo
                      </label>
                      {!showNewTypeInput ? (
                        <div className="relative group">
                          <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#9CA3AF] dark:group-focus-within:text-primary transition-colors text-[20px] z-10">
                            style
                          </span>
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDropdown(
                                openDropdown === "type" ? null : "type"
                              );
                            }}
                            className="w-full pl-10 pr-10 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white cursor-pointer flex items-center justify-between"
                          >
                            <span
                              className={!formData.type ? "text-gray-400" : ""}
                            >
                              {formData.type
                                ? types.find((t) => t.id === formData.type)
                                    ?.valor || "Seleccionar tipo"
                                : "Seleccionar tipo"}
                            </span>
                            <span className="material-symbols-outlined text-[#9CA3AF]">
                              expand_more
                            </span>
                          </div>
                          {openDropdown === "type" && (
                            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                              {loadingOrganizeData ? (
                                <div className="px-4 py-8 text-center text-sm text-gray-500">
                                  Cargando...
                                </div>
                              ) : (
                                <>
                                  {types.map((type) => (
                                    <div
                                      key={type.id}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleInputChange("type", type.id);
                                        setOpenDropdown(null);
                                      }}
                                      className={`px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2 ${
                                        formData.type === type.id
                                          ? "bg-echo-blue/10 dark:bg-primary/20"
                                          : ""
                                      }`}
                                    >
                                      {formData.type === type.id && (
                                        <span className="material-symbols-outlined text-echo-blue dark:text-primary text-sm">
                                          check
                                        </span>
                                      )}
                                      <span className="text-sm text-gray-700 dark:text-gray-300">
                                        {type.valor}
                                      </span>
                                    </div>
                                  ))}
                                  <div
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setShowNewTypeInput(true);
                                      setOpenDropdown(null);
                                    }}
                                    className="px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2 border-t border-gray-200 dark:border-gray-700"
                                  >
                                    <span className="material-symbols-outlined text-echo-blue dark:text-primary text-sm">
                                      add
                                    </span>
                                    <span className="text-sm text-echo-blue dark:text-primary font-medium">
                                      Crear nuevo tipo
                                    </span>
                                  </div>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newTypeName}
                            onChange={(e) => setNewTypeName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleCreateType();
                              } else if (e.key === "Escape") {
                                setShowNewTypeInput(false);
                                setNewTypeName("");
                              }
                            }}
                            placeholder="Nombre del nuevo tipo"
                            className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-echo-blue dark:focus:ring-primary focus:border-transparent"
                            autoFocus
                          />
                          <button
                            onClick={handleCreateType}
                            disabled={creatingType || !newTypeName.trim()}
                            className="px-4 py-2.5 bg-echo-blue dark:bg-primary text-white rounded-lg hover:bg-echo-blue/90 dark:hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {creatingType ? "..." : "Crear"}
                          </button>
                          <button
                            onClick={() => {
                              setShowNewTypeInput(false);
                              setNewTypeName("");
                            }}
                            className="px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                          >
                            Cancelar
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Colección */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Colección
                      </label>
                      <div className="relative group">
                        <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#9CA3AF] dark:text-gray-400 transition-colors text-[20px] z-10">
                          collections_bookmark
                        </span>
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenDropdown(
                              openDropdown === "collection"
                                ? null
                                : "collection"
                            );
                          }}
                          className="w-full pl-10 pr-10 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white cursor-pointer flex items-center justify-between"
                        >
                          <span
                            className={
                              !formData.collection ? "text-gray-400" : ""
                            }
                          >
                            {formData.collection
                              ? collections.find(
                                  (c) => c.id === formData.collection
                                )?.nombre || "Seleccionar colección"
                              : "Seleccionar colección"}
                          </span>
                          <span className="material-symbols-outlined text-[#9CA3AF]">
                            expand_more
                          </span>
                        </div>
                        {openDropdown === "collection" && (
                          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {loadingOrganizeData ? (
                              <div className="px-4 py-8 text-center text-sm text-gray-500">
                                Cargando...
                              </div>
                            ) : collections.length === 0 ? (
                              <div className="px-4 py-8 text-center text-sm text-gray-500">
                                No hay colecciones disponibles
                              </div>
                            ) : (
                              collections.map((collection) => (
                                <div
                                  key={collection.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleInputChange(
                                      "collection",
                                      collection.id
                                    );
                                    setOpenDropdown(null);
                                  }}
                                  className={`px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2 ${
                                    formData.collection === collection.id
                                      ? "bg-echo-blue/10 dark:bg-primary/20"
                                      : ""
                                  }`}
                                >
                                  {formData.collection === collection.id && (
                                    <span className="material-symbols-outlined text-echo-blue dark:text-primary text-sm">
                                      check
                                    </span>
                                  )}
                                  <span className="text-sm text-gray-700 dark:text-gray-300">
                                    {collection.titulo}
                                  </span>
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Categorías */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Categorías
                      </label>
                      <div className="relative group">
                        <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 group-focus-within:text-gray-600 dark:group-focus-within:text-gray-300 transition-colors text-[20px] z-10">
                          category
                        </span>
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenDropdown(
                              openDropdown === "categories"
                                ? null
                                : "categories"
                            );
                          }}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white cursor-pointer flex items-center justify-between"
                        >
                          <span
                            className={
                              formData.categories.length === 0
                                ? "text-gray-400"
                                : ""
                            }
                          >
                            {formData.categories.length > 0
                              ? `${formData.categories.length}x Seleccionado`
                              : "Seleccionar categorías"}
                          </span>
                          {formData.categories.length > 0 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleInputChange("categories", []);
                              }}
                              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                              <span className="material-symbols-outlined text-sm">
                                close
                              </span>
                            </button>
                          )}
                          <span className="material-symbols-outlined text-[#9CA3AF]">
                            expand_more
                          </span>
                        </div>
                        {openDropdown === "categories" && (
                          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {loadingOrganizeData ? (
                              <div className="px-4 py-8 text-center text-sm text-gray-500">
                                Cargando...
                              </div>
                            ) : categories.length === 0 ? (
                              <div className="px-4 py-8 text-center text-sm text-gray-500">
                                No hay categorías disponibles
                              </div>
                            ) : (
                              categories.map((cat) => (
                                <div
                                  key={cat.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const newCategories =
                                      formData.categories.includes(cat.id)
                                        ? formData.categories.filter(
                                            (c) => c !== cat.id
                                          )
                                        : [...formData.categories, cat.id];
                                    handleInputChange(
                                      "categories",
                                      newCategories
                                    );
                                  }}
                                  className={`px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2 ${
                                    formData.categories.includes(cat.id)
                                      ? "bg-echo-blue/10 dark:bg-primary/20"
                                      : ""
                                  }`}
                                >
                                  {formData.categories.includes(cat.id) && (
                                    <span className="material-symbols-outlined text-echo-blue dark:text-primary text-sm">
                                      check
                                    </span>
                                  )}
                                  <span className="text-sm text-gray-700 dark:text-gray-300">
                                    {cat.nombre}
                                  </span>
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Etiquetas */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Etiquetas
                      </label>
                      <div className="relative group">
                        <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#9CA3AF] dark:text-gray-400 transition-colors text-[20px] z-10">
                          label
                        </span>
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenDropdown(
                              openDropdown === "tags" ? null : "tags"
                            );
                          }}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white cursor-pointer flex items-center justify-between"
                        >
                          <span
                            className={
                              formData.tags.length === 0 ? "text-gray-400" : ""
                            }
                          >
                            {formData.tags.length > 0
                              ? `${formData.tags.length}x Seleccionado`
                              : "Seleccionar etiquetas"}
                          </span>
                          {formData.tags.length > 0 && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleInputChange("tags", []);
                              }}
                              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                              <span className="material-symbols-outlined text-sm">
                                close
                              </span>
                            </button>
                          )}
                          <span className="material-symbols-outlined text-gray-400">
                            expand_more
                          </span>
                        </div>
                        {openDropdown === "tags" && (
                          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {loadingOrganizeData ? (
                              <div className="px-4 py-8 text-center text-sm text-gray-500">
                                Cargando...
                              </div>
                            ) : tags.length === 0 ? (
                              <div className="px-4 py-8 text-center text-sm text-gray-500">
                                No hay etiquetas disponibles
                              </div>
                            ) : (
                              tags.map((tag) => (
                                <div
                                  key={tag.id}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const newTags = formData.tags.includes(
                                      tag.id
                                    )
                                      ? formData.tags.filter(
                                          (t) => t !== tag.id
                                        )
                                      : [...formData.tags, tag.id];
                                    handleInputChange("tags", newTags);
                                  }}
                                  className={`px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2 ${
                                    formData.tags.includes(tag.id)
                                      ? "bg-echo-blue/10 dark:bg-primary/20"
                                      : ""
                                  }`}
                                >
                                  {formData.tags.includes(tag.id) && (
                                    <span className="material-symbols-outlined text-echo-blue dark:text-primary text-sm">
                                      check
                                    </span>
                                  )}
                                  <span className="text-sm text-gray-700 dark:text-gray-300">
                                    {tag.valor}
                                  </span>
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tarjeta de Distribución */}
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-echo-blue dark:text-primary">
                    local_shipping
                  </span>
                  Distribución
                </h3>

                <div className="space-y-6">
                  {/* Perfil de envío */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Perfil de envío
                    </label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Conecta el producto a un perfil de envío
                    </p>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.shippingProfile}
                        onChange={(e) =>
                          handleInputChange("shippingProfile", e.target.value)
                        }
                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-echo-blue dark:focus:ring-primary focus:border-transparent pr-10"
                        placeholder="Seleccionar perfil de envío"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none">
                        <span className="material-symbols-outlined">
                          expand_more
                        </span>
                      </span>
                    </div>
                  </div>

                  {/* Canales de venta */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Canales de venta
                    </label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Este producto solo estará disponible en el canal de ventas
                      predeterminado si no se modifica.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.salesChannels.map((channel, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
                        >
                          {channel}
                          <button
                            onClick={() => {
                              const newChannels = formData.salesChannels.filter(
                                (_, i) => i !== idx
                              );
                              handleInputChange("salesChannels", newChannels);
                            }}
                            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-200"
                          >
                            <span className="material-symbols-outlined text-sm">
                              close
                            </span>
                          </button>
                        </span>
                      ))}
                    </div>
                    {formData.salesChannels.length > 0 && (
                      <button
                        onClick={() => handleInputChange("salesChannels", [])}
                        className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        Borrar todo
                      </button>
                    )}
                    <div className="mt-2 relative">
                      <input
                        type="text"
                        placeholder="Agregar canal de venta"
                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-echo-blue dark:focus:ring-primary focus:border-transparent pr-10"
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            const input = e.currentTarget;
                            const value = input.value.trim();
                            if (
                              value &&
                              !formData.salesChannels.includes(value)
                            ) {
                              handleInputChange("salesChannels", [
                                ...formData.salesChannels,
                                value,
                              ]);
                              input.value = "";
                            }
                          }
                        }}
                      />
                      <button className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1 bg-echo-blue dark:bg-primary text-white rounded text-sm hover:bg-echo-blue-variant dark:hover:bg-blue-700">
                        Agregar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Action Bar */}
        <div className="border-t border-gray-200 dark:border-gray-700 px-4 md:px-6 py-3 md:py-4">
          {saveError && (
            <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-600 dark:text-red-400">
              {saveError}
            </div>
          )}
          <div className="flex flex-col sm:flex-row justify-end gap-2 md:gap-3">
            <button
              onClick={handleClose}
              disabled={isSaving}
              className="px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              onClick={() => handleSaveProduct(true)}
              disabled={!formData.title || isSaving}
              className="px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? "Guardando..." : "Guardar como borrador"}
            </button>
            {activeTab === "variants" ? (
              <button
                onClick={() => handleSaveProduct(false)}
                disabled={!formData.title || isSaving}
                className="px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base bg-echo-blue dark:bg-primary text-white rounded-lg hover:bg-echo-blue-variant dark:hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? "Publicando..." : "Publicar"}
              </button>
            ) : (
              <button
                disabled={!formData.title}
                onClick={() => {
                  if (activeTab === "details") {
                    setActiveTab("organize");
                  } else if (activeTab === "organize") {
                    setActiveTab("variants");
                  }
                }}
                className={`px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base text-white rounded-lg transition-colors font-medium ${
                  !formData.title
                    ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                    : "bg-echo-blue dark:bg-primary hover:bg-echo-blue-variant dark:hover:bg-blue-700"
                }`}
                title={
                  !formData.title ? "Ingresa un título para continuar" : ""
                }
              >
                Continuar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewProductForm;
