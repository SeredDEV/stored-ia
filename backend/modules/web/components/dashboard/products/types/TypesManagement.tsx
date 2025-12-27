import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { fakerES as faker } from '@faker-js/faker';
import { ProductType, CreateProductTypeInput } from './types';
import { TypeForm } from './TypeForm';
import { TypeTable } from './TypeTable';
import { TypeMobileList } from './TypeMobileList';
import { DeleteConfirmationModal } from '../collections/DeleteConfirmationModal';

// Mock data
const generateMockTypes = (count: number): ProductType[] => {
  return Array.from({ length: count }).map(() => ({
    id: faker.string.uuid(),
    name: faker.commerce.department().toLowerCase(),
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
  }));
};

const TypesManagement = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [types, setTypes] = useState<ProductType[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingType, setEditingType] = useState<ProductType | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [typeToDelete, setTypeToDelete] = useState<ProductType | null>(null);

  useEffect(() => {
    setTypes(generateMockTypes(20));
  }, []);

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

      {/* Buscador */}
      <div className="mb-6">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">
            search
          </span>
          <input
            type="text"
            placeholder="Buscar tipos..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-echo-blue/50 text-gray-700 dark:text-gray-200 placeholder-gray-400 transition-all"
          />
        </div>
      </div>

      <div className="hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <TypeTable 
          types={types} 
          globalFilter={globalFilter}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      </div>

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
