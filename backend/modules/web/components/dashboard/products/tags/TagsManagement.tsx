import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProductTag, CreateProductTagInput } from './types';
import { TagForm } from './TagForm';
import { TagTable } from './TagTable';
import { TagMobileList } from './TagMobileList';
import { DeleteConfirmationModal } from '../collections/DeleteConfirmationModal';
import { fakerES as faker } from '@faker-js/faker';

// Mock data
const generateMockTags = (count: number): ProductTag[] => {
  return Array.from({ length: count }).map(() => ({
    id: faker.string.uuid(),
    name: faker.commerce.productAdjective(),
    createdAt: faker.date.past().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
  }));
};

const TagsManagement = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [tags, setTags] = useState<ProductTag[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingTag, setEditingTag] = useState<ProductTag | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<ProductTag | null>(null);

  useEffect(() => {
    setTags(generateMockTags(20));
  }, []);

  // Sincronizar estado con URL
  useEffect(() => {
    const action = searchParams.get('action');
    const id = searchParams.get('id');

    if (action === 'new') {
      setIsCreating(true);
      setEditingTag(null);
    } else if (action === 'edit' && id) {
      const tagToEdit = tags.find(t => t.id === id);
      if (tagToEdit) {
        setEditingTag(tagToEdit);
        setIsCreating(false);
      }
    } else {
      setIsCreating(false);
      setEditingTag(null);
    }
  }, [searchParams, tags]);

  const handleCreate = (data: CreateProductTagInput) => {
    const newTag: ProductTag = {
      id: Math.random().toString(36).substr(2, 9),
      name: data.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTags([newTag, ...tags]);
    router.push('/dashboard?view=tags');
  };

  const handleUpdate = (data: CreateProductTagInput) => {
    if (!editingTag) return;
    
    const updatedTags = tags.map(t => 
      t.id === editingTag.id 
        ? { ...t, name: data.name, updatedAt: new Date().toISOString() }
        : t
    );
    
    setTags(updatedTags);
    router.push('/dashboard?view=tags');
  };

  const handleDeleteClick = (id: string) => {
    const tag = tags.find(t => t.id === id);
    if (tag) {
      setTagToDelete(tag);
      setDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (tagToDelete) {
      setTags(tags.filter(t => t.id !== tagToDelete.id));
      setTagToDelete(null);
      setDeleteModalOpen(false);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/dashboard?view=tags&action=edit&id=${id}`);
  };

  const handleCancel = () => {
    router.push('/dashboard?view=tags');
  };

  if (isCreating || editingTag) {
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
            {editingTag ? 'Editar Etiqueta' : 'Crear Etiqueta'}
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-6 -mt-4 pl-14">
          Crea una nueva etiqueta para categorizar tus productos.
        </p>
        <TagForm 
          onSubmit={editingTag ? handleUpdate : handleCreate} 
          onCancel={handleCancel}
          initialData={editingTag ? { name: editingTag.name } : undefined}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">Etiquetas</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestiona las etiquetas de tus productos.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => router.push('/dashboard?view=tags&action=new')}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-echo-blue hover:bg-echo-blue/90 text-white rounded-lg transition-colors shadow-sm"
          >
            <span className="font-medium">Crear</span>
          </button>
        </div>
      </div>

      {/* Buscador */}
      <div className="mb-6">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-[#9CA3AF] text-[20px]">search</span>
          <input 
            type="text" 
            placeholder="Buscar" 
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-echo-blue/20 focus:border-echo-blue transition-all"
          />
        </div>
      </div>

      <div className="hidden md:block">
        <TagTable 
          tags={tags} 
          globalFilter={globalFilter}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      </div>

      <TagMobileList 
        tags={tags} 
        onEdit={handleEdit} 
        onDelete={handleDeleteClick} 
      />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={tagToDelete?.name}
      />
    </div>
  );
};

export default TagsManagement;
