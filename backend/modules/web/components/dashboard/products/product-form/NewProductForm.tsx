"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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

const NewProductForm: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTab = (searchParams.get("tab") as "details" | "organize" | "variants") || "details";

  const setActiveTab = (tab: "details" | "organize" | "variants") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.push(`?${params.toString()}`);
  };

  const activeTab = currentTab;

  const [formData, setFormData] = useState<ProductFormData>({
    title: "",
    subtitle: "",
    handle: "",
    description: "",
    hasVariants: false,
    media: [],
    options: [],
    variants: [],
    discountApplicable: false,
    type: "",
    collection: "",
    categories: [],
    tags: [],
    shippingProfile: "",
    salesChannels: ["Default Sales Channel"],
  });

  // Estados para dropdowns abiertos
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Función para generar variantes basadas en las opciones
  // Las variantes son los valores individuales de cada opción
  const generateVariants = (options: ProductOption[]): ProductVariant[] => {
    const variants: ProductVariant[] = [];

    options.forEach((option) => {
      // Agregar el título de la opción como variante
      if (option.title) {
        variants.push({
          id: `option-${option.id}`,
          name: option.title,
          selected: true,
        });
      }

      // Agregar cada valor de la opción como variante
      option.values.forEach((value, idx) => {
        variants.push({
          id: `value-${option.id}-${idx}`,
          name: value,
          selected: true,
        });
      });
    });

    return variants;
  };

  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData((prev) => {
      const updated: ProductFormData = { ...prev, [field]: value };

      // Auto-generar handle desde el título
      if (field === "title" && typeof value === "string") {
        const handle = value
          .toLowerCase()
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
        updated.handle = handle;
      }

      // Generar variantes cuando se activa el toggle de variantes
      if (field === "hasVariants") {
        if (value === true && updated.options.length > 0) {
          updated.variants = generateVariants(updated.options);
        } else if (value === false) {
          updated.variants = [];
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

  return (
    <div className="w-[calc(100%+2rem)] -m-4 md:w-full md:m-0">
      <div className="bg-white dark:bg-surface-dark w-full rounded-none md:rounded-xl shadow-sm border-y md:border border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Header con tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 px-3 md:px-6 flex items-center justify-between gap-3 bg-white dark:bg-surface-dark rounded-none md:rounded-t-xl sticky top-0 z-30">
          <div className="flex flex-1 items-center min-w-0">
            <div className="flex flex-1 md:flex-none justify-between md:justify-start gap-0 md:gap-6 w-full md:w-auto">
              <button
                onClick={() => setActiveTab("details")}
                className={`relative flex-1 md:flex-none px-2 md:px-3 py-4 text-sm font-medium whitespace-nowrap text-center transition-colors ${
                  activeTab === "details"
                    ? "text-echo-blue dark:text-primary"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                Detalles
                {activeTab === "details" && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-echo-blue dark:bg-primary rounded-t-full" />
                )}
              </button>
              
              <button
                onClick={() => setActiveTab("organize")}
                className={`relative flex-1 md:flex-none px-2 md:px-3 py-4 text-sm font-medium whitespace-nowrap text-center transition-colors ${
                  activeTab === "organize"
                    ? "text-echo-blue dark:text-primary"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                Organizar
                {activeTab === "organize" && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-echo-blue dark:bg-primary rounded-t-full" />
                )}
              </button>
              
              <button
                onClick={() => setActiveTab("variants")}
                className={`relative flex-1 md:flex-none px-2 md:px-3 py-4 text-sm font-medium whitespace-nowrap text-center transition-colors ${
                  activeTab === "variants"
                    ? "text-echo-blue dark:text-primary"
                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                Variantes
                {activeTab === "variants" && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-echo-blue dark:bg-primary rounded-t-full" />
                )}
              </button>
            </div>
          </div>
          
          <button 
            onClick={onClose}
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
                        <span className="text-red-500 text-lg leading-none" title="Obligatorio">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) =>
                          handleInputChange("title", e.target.value)
                        }
                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-echo-blue dark:focus:ring-primary focus:border-transparent"
                        placeholder="Ej: Chaqueta de invierno"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Subtítulo
                      </label>
                      <input
                        type="text"
                        value={formData.subtitle}
                        onChange={(e) =>
                          handleInputChange("subtitle", e.target.value)
                        }
                        className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-echo-blue dark:focus:ring-primary focus:border-transparent"
                        placeholder="Ej: Cálido y acogedor"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Manejo
                      <span
                        className="material-symbols-outlined text-gray-400 text-sm cursor-help"
                        title="URL amigable para el producto"
                      >
                        info
                      </span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                        /
                      </span>
                      <input
                        type="text"
                        value={formData.handle}
                        onChange={(e) =>
                          handleInputChange("handle", e.target.value)
                        }
                        className="w-full pl-8 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-echo-blue dark:focus:ring-primary focus:border-transparent"
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
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-echo-blue dark:hover:border-primary transition-colors">
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
                        className="cursor-pointer flex flex-col items-center gap-3"
                      >
                        <span className="material-symbols-outlined text-4xl text-gray-400 dark:text-gray-500">
                          cloud_upload
                        </span>
                        <div>
                          <div className="text-echo-blue dark:text-primary font-medium mb-1">
                            Subir imágenes
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Arrastra y suelta imágenes aquí o haz clic para
                            cargar.
                          </div>
                        </div>
                      </label>
                    </div>
                    {formData.media.length > 0 && (
                      <div className="mt-4 grid grid-cols-4 gap-4">
                        {formData.media.map((file, index) => (
                          <div
                            key={index}
                            className="relative group border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                          >
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              className="w-full h-32 object-cover"
                            />
                            <button
                              onClick={() => handleRemoveMedia(index)}
                              className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <span className="material-symbols-outlined text-sm">
                                close
                              </span>
                            </button>
                            <div className="p-2 bg-white dark:bg-gray-800">
                              <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                {file.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-500">
                                {(file.size / 1024).toFixed(2)} KB
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
                                      className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-echo-blue dark:focus:ring-primary focus:border-transparent"
                                    />
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
                    <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                      {formData.variants.filter((v) => !v.id.startsWith("option-")).length === 0 ? (
                        <div className="p-8 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-surface-dark">
                          <span className="material-symbols-outlined text-4xl mb-2 block mx-auto opacity-50">
                            inventory_2
                          </span>
                          <p>No hay variantes generadas.</p>
                          <p className="text-sm mt-1">
                            Agrega opciones en la pestaña "Detalles" para generar variantes.
                          </p>
                        </div>
                      ) : (
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
                                  Color
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
                                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase block" title="Inventario Gestionado">
                                  Inv. Gest.
                                </span>
                              </th>
                              <th className="px-2 py-3 text-center w-28 bg-gray-50 dark:bg-gray-800">
                                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase block" title="Pedido Pendiente">
                                  Ped. Pend.
                                </span>
                              </th>
                              <th className="px-2 py-3 text-center w-24 bg-gray-50 dark:bg-gray-800">
                                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase block" title="Kit Inventario">
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
                                            setFormData(prev => ({
                                                ...prev,
                                                variants: prev.variants.filter(v => v.id !== variant.id)
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
                                      value={variant.name}
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
                                      className="w-full px-2.5 py-1.5 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-echo-blue dark:focus:ring-primary focus:border-transparent transition-all"
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
                                        className="w-4 h-4 text-echo-blue dark:text-primary border-gray-300 rounded focus:ring-2 focus:ring-echo-blue dark:focus:ring-primary cursor-pointer"
                                      />
                                    </div>
                                  </td>
                                  <td className="px-2 py-3">
                                    <div className="flex items-center justify-center">
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
                                                    allowBackorder: e.target.checked,
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
                                        checked={variant.hasInventoryKit || false}
                                        onChange={(e) => {
                                          setFormData((prev) => ({
                                            ...prev,
                                            variants: prev.variants.map((v) =>
                                              v.id === variant.id
                                                ? {
                                                    ...v,
                                                    hasInventoryKit: e.target.checked,
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
                                                ? { ...v, priceCOP: e.target.value }
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
                      )}
                    </div>
              </div>
            </div>
          )}

          {activeTab === "organize" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Organizar
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
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.type}
                          onChange={(e) =>
                            handleInputChange("type", e.target.value)
                          }
                          className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-echo-blue dark:focus:ring-primary focus:border-transparent pr-10"
                          placeholder="Seleccionar tipo"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                          <span className="material-symbols-outlined">
                            expand_more
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Colección */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Colección
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.collection}
                          onChange={(e) =>
                            handleInputChange("collection", e.target.value)
                          }
                          className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-echo-blue dark:focus:ring-primary focus:border-transparent pr-10"
                          placeholder="Seleccionar colección"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                          <span className="material-symbols-outlined">
                            expand_more
                          </span>
                        </span>
                      </div>
                    </div>

                    {/* Categorías */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Categorías
                      </label>
                      <div className="relative">
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenDropdown(
                              openDropdown === "categories" ? null : "categories"
                            );
                          }}
                          className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white cursor-pointer flex items-center justify-between"
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
                          <span className="material-symbols-outlined text-gray-400">
                            expand_more
                          </span>
                        </div>
                        {openDropdown === "categories" && (
                          <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {[
                              "Camisetas",
                              "Sudaderas",
                              "Pantalones",
                              "Merchandising",
                            ].map((cat) => (
                              <div
                                key={cat}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const newCategories =
                                    formData.categories.includes(cat)
                                      ? formData.categories.filter(
                                          (c) => c !== cat
                                        )
                                      : [...formData.categories, cat];
                                  handleInputChange("categories", newCategories);
                                }}
                                className={`px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2 ${
                                  formData.categories.includes(cat)
                                    ? "bg-echo-blue/10 dark:bg-primary/20"
                                    : ""
                                }`}
                              >
                                {formData.categories.includes(cat) && (
                                  <span className="material-symbols-outlined text-echo-blue dark:text-primary text-sm">
                                    check
                                  </span>
                                )}
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                  {cat}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Etiquetas */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Etiquetas
                      </label>
                      <div className="relative">
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenDropdown(
                              openDropdown === "tags" ? null : "tags"
                            );
                          }}
                          className="w-full px-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white cursor-pointer flex items-center justify-between"
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
                            {[
                              "temporada",
                              "nuevo",
                              "premium",
                              "oferta",
                              "popular",
                            ].map((tag) => (
                              <div
                                key={tag}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const newTags = formData.tags.includes(tag)
                                    ? formData.tags.filter((t) => t !== tag)
                                    : [...formData.tags, tag];
                                  handleInputChange("tags", newTags);
                                }}
                                className={`px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer flex items-center gap-2 ${
                                  formData.tags.includes(tag)
                                    ? "bg-echo-blue/10 dark:bg-primary/20"
                                    : ""
                                }`}
                              >
                                {formData.tags.includes(tag) && (
                                  <span className="material-symbols-outlined text-echo-blue dark:text-primary text-sm">
                                    check
                                  </span>
                                )}
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                  {tag}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

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
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
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
        <div className="border-t border-gray-200 dark:border-gray-700 px-4 md:px-6 py-3 md:py-4 flex flex-col sm:flex-row justify-end gap-2 md:gap-3">
          <button
            onClick={onClose}
            className="px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button className="px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            Guardar como borrador
          </button>
          {activeTab === "variants" ? (
            <button className="px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base bg-echo-blue dark:bg-primary text-white rounded-lg hover:bg-echo-blue-variant dark:hover:bg-blue-700 transition-colors font-medium">
              Publicar
            </button>
          ) : (
            <button
              onClick={() => {
                if (activeTab === "details") {
                  setActiveTab("organize");
                } else if (activeTab === "organize") {
                  setActiveTab("variants");
                }
              }}
              className="px-3 md:px-4 py-1.5 md:py-2 text-sm md:text-base bg-echo-blue dark:bg-primary text-white rounded-lg hover:bg-echo-blue-variant dark:hover:bg-blue-700 transition-colors font-medium"
            >
              Continuar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewProductForm;
