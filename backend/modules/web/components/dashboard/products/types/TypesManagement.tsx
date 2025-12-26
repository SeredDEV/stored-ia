import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProductType, CreateProductTypeInput } from './types';
import { TypeForm } from './TypeForm';
import { TypeList } from './TypeList';
import { TypeMobileList } from './TypeMobileList';
import { DeleteConfirmationModal } from '../collections/DeleteConfirmationModal';

// Mock data
const MOCK_TYPES: ProductType[] = [
  { 
    id: '1', 
    name: 'ropa', 
    createdAt: new Date('2025-12-21').toISOString(), 
    updatedAt: new Date('2025-12-21').toISOString() 
  },
  { 
    id: '2', 
    name: 'calzado', 
    createdAt: new Date('2025-12-21').toISOString(), 
    updatedAt: new Date('2025-12-21').toISOString() 
  },
  { 
    id: '3', 
    name: 'accesorios', 
    createdAt: new Date('2025-12-21').toISOString(), 
    updatedAt: new Date('2025-12-21').toISOString() 
  },
];

const TypesManagement = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [types, setTypes] = useState<ProductType[]>(MOCK_TYPES);
  const [isCreating, setIsCreating] = useState(false);
  const [editingType, setEditingType] = useState<ProductType | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [typeToDelete, setTypeToDelete] = useState<ProductType | null>(null);

  // Sincronizar estado con URL
  useEffect(() => {
    const action = searchParams.get('action');
    const id = searchParams.get('id');

    if (action === 'new') {
      setIsCreating(true);
      setEditingType(null);
    } else if (action === 'edit' && id) {
      const typeToEdit = types.find(t => t.id === id);
      if (typeToEdit) {
        setEditingType(typeToEdit);
        setIsCreating(false);
      }
    } else {
      setIsCreating(false);
      setEditingType(null);
    }
  }, [searchParams, types]);

  const handleCreate = (data: CreateProductTypeInput) => {
    const newType: ProductType = {
      id: Math.random().toString(36).substr(2, 9),
      name: data.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTypes([newType, ...types]);
    router.push('/dashboard?view=types');
  };

  const handleUpdate = (data: CreateProductTypeInput) => {
    if (!editingType) return;
    
    const updatedTypes = types.map(t => 
      t.id === editingType.id 
        ? { ...t, name: data.name, updatedAt: new Date().toISOString() }
        : t
    );
    
    setTypes(updatedTypes);
    router.push('/dashboard?view=types');
  };

  const handleDeleteClick = (id: string) => {
    const type = types.find(t => t.id === id);
    if (type) {
      setTypeToDelete(type);
      setDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (typeToDelete) {
      setTypes(types.filter(t => t.id !== typeToDelete.id));
      setTypeToDelete(null);
      setDeleteModalOpen(false);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/dashboard?view=types&action=edit&id=${id}`);
  };

  const handleCancel = () => {
    router.push('/dashboard?view=types');
  };

  if (isCreating || editingType) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6 flex items-center gap-4">
          <button 
            onClick={handleCancel}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            {editingType ? 'Editar Tipo de Producto' : 'Crear Tipo de Producto'}
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-6 -mt-4 pl-14">
          Crea un nuevo tipo de producto para categorizar tus productos.
        </p>
        <TypeForm 
          onSubmit={editingType ? handleUpdate : handleCreate} 
          onCancel={handleCancel}
          initialData={editingType ? { name: editingType.name } : undefined}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">Tipos de Producto</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Organiza tus productos en tipos.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => router.push('/dashboard?view=types&action=new')}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-echo-blue hover:bg-echo-blue/90 text-white rounded-lg transition-colors shadow-sm"
          >
            <span className="font-medium">Crear</span>
          </button>
        </div>
      </div>

      {/* Buscador (Placeholder visual) */}
      <div className="mb-6">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-[20px]">search</span>
          <input 
            type="text" 
            placeholder="Buscar" 
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-echo-blue/20 focus:border-echo-blue transition-all"
          />
        </div>
      </div>

      <TypeList 
        types={types} 
        onDelete={handleDeleteClick}
        onEdit={handleEdit}
      />

      <TypeMobileList 
        types={types} 
        onEdit={handleEdit} 
        onDelete={handleDeleteClick} 
      />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={typeToDelete?.name}
      />
    </div>
  );
};

export default TypesManagement;
