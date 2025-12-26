import React, { useState } from 'react';
import { CreateProductTypeInput } from './types';

interface TypeFormProps {
  onSubmit: (data: CreateProductTypeInput) => void;
  onCancel: () => void;
  initialData?: Partial<CreateProductTypeInput>;
}

export const TypeForm: React.FC<TypeFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const [name, setName] = useState(initialData?.name || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name });
  };

  return (
    <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header del Formulario */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Crear Tipo de Producto</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Crea un nuevo tipo de producto para categorizar tus productos.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        <div className="max-w-xl">
          {/* Valor (Nombre) */}
          <div className="space-y-3">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Valor
            </label>
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#9CA3AF] dark:text-gray-400 transition-colors text-[20px]">
                title
              </span>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-echo-blue/20 focus:border-echo-blue transition-all"
                placeholder="test"
                required
                autoFocus
              />
            </div>
          </div>
        </div>

        {/* Footer con Acciones */}
        <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
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
            Guardar Tipo
          </button>
        </div>
      </form>
    </div>
  );
};
