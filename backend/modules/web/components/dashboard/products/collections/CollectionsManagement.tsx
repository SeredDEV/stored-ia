import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { fakerES as faker } from '@faker-js/faker';
import { Collection, CreateCollectionInput } from './types';
import { CollectionForm } from './CollectionForm';
import { CollectionTable } from './CollectionTable';
import { CollectionMobileList } from './CollectionMobileList';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';

const generateMockCollections = (count: number): Collection[] => {
  return Array.from({ length: count }).map(() => {
    const title = faker.commerce.department() + ' ' + faker.date.future().getFullYear();
    return {
      id: faker.string.uuid(),
      title: title,
      slug: `/${title.toLowerCase().replace(/\s+/g, '-')}`,
      productsCount: faker.number.int({ min: 0, max: 100 }),
      createdAt: faker.date.past().toISOString(),
      updatedAt: faker.date.recent().toISOString(),
    };
  });
};

const CollectionsManagement = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [collections, setCollections] = useState<Collection[]>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [collectionToDelete, setCollectionToDelete] = useState<Collection | null>(null);

  // Generar datos mock al montar el componente para evitar errores de hidratación
  useEffect(() => {
    setCollections(generateMockCollections(20));
  }, []);

  // Sincronizar estado con URL
  useEffect(() => {
    const action = searchParams.get('action');
    const id = searchParams.get('id');

    if (action === 'new') {
      setIsCreating(true);
      setEditingCollection(null);
    } else if (action === 'edit' && id) {
      const collectionToEdit = collections.find(c => c.id === id);
      if (collectionToEdit) {
        setEditingCollection(collectionToEdit);
        setIsCreating(false);
      }
    } else {
      setIsCreating(false);
      setEditingCollection(null);
    }
  }, [searchParams, collections]);

  const handleCreate = (data: CreateCollectionInput) => {
    const newCollection: Collection = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      productsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCollections([newCollection, ...collections]);
    router.push('/dashboard?view=collections');
  };

  const handleUpdate = (data: CreateCollectionInput) => {
    if (!editingCollection) return;
    
    const updatedCollections = collections.map(c => 
      c.id === editingCollection.id 
        ? { ...c, ...data, updatedAt: new Date().toISOString() }
        : c
    );
    
    setCollections(updatedCollections);
    router.push('/dashboard?view=collections');
  };

  const handleDeleteClick = (id: string) => {
    const collection = collections.find(c => c.id === id);
    if (collection) {
      setCollectionToDelete(collection);
      setDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (collectionToDelete) {
      setCollections(collections.filter(c => c.id !== collectionToDelete.id));
      setCollectionToDelete(null);
      setDeleteModalOpen(false);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/dashboard?view=collections&action=edit&id=${id}`);
  };

  const handleCancel = () => {
    router.push('/dashboard?view=collections');
  };


  if (isCreating || editingCollection) {
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
            {editingCollection ? 'Editar Colección' : 'Nueva Colección'}
          </h1>
        </div>
        <CollectionForm 
          onSubmit={editingCollection ? handleUpdate : handleCreate} 
          onCancel={handleCancel}
          initialData={editingCollection ? {
            title: editingCollection.title,
            slug: editingCollection.slug
          } : undefined}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">Colecciones</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Gestiona las colecciones para organizar tus productos.
          </p>
        </div>
        <button
          onClick={() => router.push('/dashboard?view=collections&action=new')}
          className="flex items-center gap-2 px-4 py-2 bg-echo-blue hover:bg-echo-blue/90 text-white rounded-lg transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          <span className="font-medium">Crear Colección</span>
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">
            search
          </span>
          <input
            type="text"
            placeholder="Buscar colecciones..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-echo-blue/50 text-gray-700 dark:text-gray-200 placeholder-gray-400 transition-all"
          />
        </div>
      </div>

      <div className="hidden md:block bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <CollectionTable
          collections={collections}
          globalFilter={globalFilter}
          onEdit={handleEdit}
          onDelete={handleDeleteClick}
        />
      </div>

      <div className="mt-6 md:hidden">
        <CollectionMobileList 
          collections={collections} 
          onEdit={handleEdit} 
          onDelete={handleDeleteClick} 
        />
      </div>

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={collectionToDelete?.title}
      />
    </div>
  );
};

export default CollectionsManagement;
