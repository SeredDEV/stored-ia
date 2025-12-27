import React, { useState, useEffect } from "react";
import { CreateCollectionInput } from "./types";

interface CollectionFormProps {
  onSubmit: (data: CreateCollectionInput) => void;
  onCancel: () => void;
  initialData?: Partial<CreateCollectionInput>;
}

export const CollectionForm: React.FC<CollectionFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
}) => {
  const [title, setTitle] = useState(initialData?.title || "");
  // Asegurar que el slug siempre tenga el "/" inicial
  const [slug, setSlug] = useState(() => {
    const initial = initialData?.slug || "";
    return initial && !initial.startsWith("/") ? `/${initial}` : initial;
  });
  const [isAutoSlug, setIsAutoSlug] = useState(!initialData?.slug);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, slug });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTitle(value);

    if (isAutoSlug) {
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
      // Siempre agregar el "/" inicial, incluso si está vacío
      setSlug(generatedSlug ? `/${generatedSlug}` : "/");
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsAutoSlug(false);
    let value = e.target.value;

    // Asegurar que siempre empiece con "/"
    if (value && !value.startsWith("/")) {
      value = `/${value}`;
    }

    // Si el usuario borra todo, dejar solo "/"
    if (!value) {
      value = "/";
    }

    setSlug(value);
  };

  return (
    <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header del Formulario */}
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Detalles de la Colección
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Configura la información básica de tu nueva colección.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Título */}
          <div className="space-y-3">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Título de la colección
            </label>
            <div className="relative group">
              <input
                type="text"
                id="title"
                value={title}
                onChange={handleTitleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-echo-blue/20 focus:border-echo-blue transition-all"
                placeholder="Ej. Ropa de Verano"
                required
                autoFocus
              />
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#9CA3AF] dark:text-gray-400 transition-colors text-[20px]">
                title
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              El nombre visible de la colección en tu tienda.
            </p>
          </div>

          {/* Manejo (Slug) */}
          <div className="space-y-3">
            <label
              htmlFor="slug"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              URL (Slug)
            </label>
            <div className="relative group">
              <input
                type="text"
                id="slug"
                value={slug}
                onChange={handleSlugChange}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 font-mono text-sm placeholder-gray-400 focus:ring-2 focus:ring-echo-blue/20 focus:border-echo-blue transition-all"
                placeholder="/ropa-de-verano"
              />
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#9CA3AF] dark:text-gray-400 transition-colors text-[20px]">
                link
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Identificador único para la URL. Se genera automáticamente si lo
              dejas vacío.
            </p>
          </div>
        </div>

        {/* Footer con Acciones */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100 dark:border-gray-700">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-transparent border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={!title}
            className="px-6 py-2.5 text-sm font-medium text-white bg-echo-blue hover:bg-echo-blue/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-echo-blue transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">save</span>
            Guardar Colección
          </button>
        </div>
      </form>
    </div>
  );
};
