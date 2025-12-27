import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Category, CreateCategoryInput } from './types';
import { CategoryForm } from './CategoryForm';
import { CategoryList } from './CategoryList';
import { CategoryMobileList } from './CategoryMobileList';
import { CategoryRanking } from './CategoryRanking';
import { DeleteConfirmationModal } from '../collections/DeleteConfirmationModal';

// Mock data
const MOCK_CATEGORIES: Category[] = [
  { 
    id: '1', 
    name: 'Camisetas', 
    slug: '/camisetas',
    description: 'Camisetas de algodón de alta calidad',
    status: 'Activa',
    visibility: 'Pública',
    productsCount: 150,
    createdAt: new Date('2024-01-10').toISOString(), 
    updatedAt: new Date('2024-01-10').toISOString() 
  },
  { 
    id: '2', 
    name: 'Sudaderas', 
    slug: '/sudaderas',
    status: 'Activa',
    visibility: 'Pública',
    productsCount: 89,
    createdAt: new Date('2024-02-05').toISOString(), 
    updatedAt: new Date('2024-02-05').toISOString() 
  },
  { 
    id: '3', 
    name: 'Merchandising', 
    slug: '/merchandising',
    status: 'Activa',
    visibility: 'Pública',
    productsCount: 45,
    createdAt: new Date('2024-03-12').toISOString(), 
    updatedAt: new Date('2024-03-12').toISOString() 
  },
  { 
    id: '4', 
    name: 'Pantalones', 
    slug: '/pantalones',
    status: 'Activa',
    visibility: 'Pública',
    productsCount: 67,
    createdAt: new Date('2024-04-01').toISOString(), 
    updatedAt: new Date('2024-04-01').toISOString() 
  },
];

const CategoriesManagement = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [isCreating, setIsCreating] = useState(false);
  const [isRanking, setIsRanking] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  // Sincronizar estado con URL
  useEffect(() => {
    const action = searchParams.get('action');
    const id = searchParams.get('id');

    if (action === 'new') {
      setIsCreating(true);
      setEditingCategory(null);
      setIsRanking(false);
    } else if (action === 'edit' && id) {
      const categoryToEdit = categories.find(c => c.id === id);
      if (categoryToEdit) {
        setEditingCategory(categoryToEdit);
        setIsCreating(false);
        setIsRanking(false);
      }
    } else if (action === 'ranking') {
      setIsRanking(true);
      setIsCreating(false);
      setEditingCategory(null);
    } else {
      setIsCreating(false);
      setEditingCategory(null);
      setIsRanking(false);
    }
  }, [searchParams, categories]);

  const handleCreate = (data: CreateCategoryInput) => {
    const newCategory: Category = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      productsCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCategories([newCategory, ...categories]);
    router.push('/dashboard?view=categories');
  };

  const handleUpdate = (data: CreateCategoryInput) => {
    if (!editingCategory) return;
    
    const updatedCategories = categories.map(c => 
      c.id === editingCategory.id 
        ? { ...c, ...data, updatedAt: new Date().toISOString() }
        : c
    );
    
    setCategories(updatedCategories);
    router.push('/dashboard?view=categories');
  };

  const handleSaveRanking = (newOrder: Category[]) => {
    setCategories(newOrder);
    router.push('/dashboard?view=categories');
  };

  const handleDeleteClick = (id: string) => {
    const category = categories.find(c => c.id === id);
    if (category) {
      setCategoryToDelete(category);
      setDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      setCategories(categories.filter(c => c.id !== categoryToDelete.id));
      setCategoryToDelete(null);
      setDeleteModalOpen(false);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/dashboard?view=categories&action=edit&id=${id}`);
  };

  const handleCancel = () => {
    router.push('/dashboard?view=categories');
  };

  if (isCreating || editingCategory) {
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
            {editingCategory ? 'Editar Categoría' : 'Crear Categoría'}
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-6 -mt-4 pl-14">
          Crea una nueva categoría para organizar tus productos.
        </p>
        <CategoryForm 
          onSubmit={editingCategory ? handleUpdate : handleCreate} 
          onCancel={handleCancel}
          initialData={editingCategory ? {
            name: editingCategory.name,
            slug: editingCategory.slug,
            description: editingCategory.description,
            status: editingCategory.status,
            visibility: editingCategory.visibility
          } : undefined}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">Categorías</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Organiza productos en categorías, y administra el ranking y jerarquía de esas categorías.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button 
            onClick={() => router.push('/dashboard?view=categories&action=ranking')}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
          >
            Editar ranking
          </button>
          <button
            onClick={() => router.push('/dashboard?view=categories&action=new')}
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

      <CategoryList 
        categories={categories} 
        onDelete={handleDeleteClick}
        onEdit={handleEdit}
      />

      <CategoryMobileList 
        categories={categories} 
        onEdit={handleEdit} 
        onDelete={handleDeleteClick} 
      />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={categoryToDelete?.name}
      />

      {isRanking && (
        <CategoryRanking 
          categories={categories}
          onSave={handleSaveRanking}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default CategoriesManagement;
