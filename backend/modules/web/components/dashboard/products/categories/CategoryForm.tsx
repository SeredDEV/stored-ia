import React, { useState, useEffect } from 'react';
import type { CategoryStatus, CategoryVisibility, CreateCategoryInput } from './types';

interface CategoryFormProps {
  onSubmit: (data: CreateCategoryInput) => void;
  onCancel: () => void;
  initialData?: Partial<CreateCategoryInput>;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [name, setName] = useState(initialData?.name || '');
  // Asegurar que el slug siempre tenga el "/" inicial
  const [slug, setSlug] = useState(() => {
    const initial = initialData?.slug || '';
    return initial && !initial.startsWith('/') ? `/${initial}` : initial;
  });
  const [description, setDescription] = useState(initialData?.description || '');
  const [status, setStatus] = useState<CategoryStatus>(initialData?.status || 'Activa');
  const [visibility, setVisibility] = useState<CategoryVisibility>(initialData?.visibility || 'Pública');
  const [isAutoSlug, setIsAutoSlug] = useState(!initialData?.slug);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, slug, description, status, visibility });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    
    if (isAutoSlug) {
      const generatedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      // Siempre agregar el "/" inicial, incluso si está vacío
      setSlug(generatedSlug ? `/${generatedSlug}` : '/');
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsAutoSlug(false);
    let value = e.target.value;
    
    // Asegurar que siempre empiece con "/"
    if (value && !value.startsWith('/')) {
      value = `/${value}`;
    }
    
    // Si el usuario borra todo, dejar solo "/"
    if (!value) {
      value = '/';
    }
    
    setSlug(value);
  };

  return (
    <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header del Formulario */}
      <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Crear Categoría</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Crea una nueva categoría para organizar tus productos.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Título */}
          <div className="space-y-3">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Título
            </label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#9CA3AF] dark:text-gray-400 transition-colors text-[20px]">
                title
              </span>
              <input
                type="text"
                id="name"
                value={name}
                onChange={handleNameChange}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-echo-blue/20 focus:border-echo-blue transition-all"
                placeholder="Ej. Camisetas"
                required
                autoFocus
              />
            </div>
          </div>

          {/* Manejo (Slug) */}
          <div className="space-y-3">
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Manejo <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#9CA3AF] dark:text-gray-400 transition-colors text-[20px]">
                link
              </span>
              <input
                type="text"
                id="slug"
                value={slug}
                onChange={handleSlugChange}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-600 dark:text-gray-300 font-mono text-sm placeholder-gray-400 focus:ring-2 focus:ring-echo-blue/20 focus:border-echo-blue transition-all"
                placeholder="/camisetas"
              />
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-3 md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Descripción <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-echo-blue/20 focus:border-echo-blue transition-all resize-none"
              placeholder="Describe esta categoría..."
            />
          </div>

          {/* Estado */}
          <div className="space-y-3">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Estado
            </label>
            <div className="relative">
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as CategoryStatus)}
                className="w-full pl-4 pr-10 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-echo-blue/20 focus:border-echo-blue transition-all appearance-none cursor-pointer"
              >
                <option value="Activa">Activa</option>
                <option value="Inactiva">Inactiva</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="material-symbols-outlined text-[#9CA3AF]">unfold_more</span>
              </div>
            </div>
          </div>

          {/* Visibilidad */}
          <div className="space-y-3">
            <label htmlFor="visibility" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Visibilidad
            </label>
            <div className="relative">
              <select
                id="visibility"
                value={visibility}
                onChange={(e) => setVisibility(e.target.value as CategoryVisibility)}
                className="w-full pl-4 pr-10 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-echo-blue/20 focus:border-echo-blue transition-all appearance-none cursor-pointer"
              >
                <option value="Pública">Pública</option>
                <option value="Interna">Interna</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="material-symbols-outlined text-[#9CA3AF]">unfold_more</span>
              </div>
            </div>
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
            disabled={!name}
            className="px-6 py-2.5 text-sm font-medium text-white bg-echo-blue hover:bg-echo-blue/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-echo-blue transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">save</span>
            Guardar Categoría
          </button>
        </div>
      </form>
    </div>
  );
};
