import React, { useState, useRef, useEffect } from 'react';
import { Category } from './types';

interface CategoryRankingProps {
  categories: Category[];
  onSave: (categories: Category[]) => void;
  onCancel: () => void;
}

export const CategoryRanking: React.FC<CategoryRankingProps> = ({ categories, onSave, onCancel }) => {
  const [items, setItems] = useState<Category[]>(categories);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const dragOverItemIndex = useRef<number | null>(null);

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCancel]);

  const handleDragStart = (index: number) => {
    setDraggedItemIndex(index);
  };

  const handleDragEnter = (index: number) => {
    dragOverItemIndex.current = index;
  };

  const handleDragEnd = () => {
    if (draggedItemIndex !== null && dragOverItemIndex.current !== null && draggedItemIndex !== dragOverItemIndex.current) {
      const newItems = [...items];
      const draggedItem = newItems[draggedItemIndex];
      newItems.splice(draggedItemIndex, 1);
      newItems.splice(dragOverItemIndex.current, 0, draggedItem);
      setItems(newItems);
    }
    setDraggedItemIndex(null);
    dragOverItemIndex.current = null;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Modal Container */}
      <div className="bg-white dark:bg-surface-dark w-full max-w-3xl rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <div className="flex items-center gap-4">
            <button 
              onClick={onCancel} 
              className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-1.5 text-xs group"
              title="Presiona ESC para cerrar"
            >
              <div className="border border-gray-300 dark:border-gray-600 rounded px-1.5 py-0.5 group-hover:border-gray-400 dark:group-hover:border-gray-400 transition-colors">esc</div>
            </button>
          </div>

          <div className="flex items-center gap-2 text-gray-900 dark:text-white">
            <span className="material-symbols-outlined text-[20px]">drag_indicator</span>
            <span className="text-sm font-medium">Organizar Ranking</span>
          </div>

          <button 
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Scrollable List */}
        <div className="p-2 overflow-y-auto flex-1 bg-white dark:bg-surface-dark">
          <ul className="space-y-1">
            {items.map((category, index) => (
              <li
                key={category.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragEnter={() => handleDragEnter(index)}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all cursor-move group
                  ${draggedItemIndex === index 
                    ? 'opacity-50 bg-gray-100 dark:bg-gray-800' 
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300'
                  }`}
              >
                {/* Drag Handle */}
                <div className="text-gray-400 dark:text-gray-600 group-hover:text-gray-600 dark:group-hover:text-gray-400 transition-colors cursor-grab active:cursor-grabbing">
                  <span className="material-symbols-outlined text-[20px]">drag_indicator</span>
                </div>

                {/* Category Icon & Name */}
                <div className="flex items-center gap-3 flex-1">
                  <span className="material-symbols-outlined text-[20px] text-echo-blue">
                    label
                  </span>
                  <span className="font-medium text-sm text-gray-900 dark:text-gray-200">
                    {category.name}
                  </span>
                </div>

                {/* Position Indicator */}
                <div className="text-xs text-gray-400 dark:text-gray-600 font-mono">
                  #{index + 1}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => onSave(items)}
            className="px-6 py-2 text-sm font-medium text-white bg-echo-blue hover:bg-echo-blue/90 rounded-lg shadow-sm transition-all"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
};
