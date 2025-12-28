import React from "react";
import { Product } from "../types";

interface ProductEditActionProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onClose?: () => void;
}

const ProductEditAction: React.FC<ProductEditActionProps> = ({
  product,
  onEdit,
  onClose,
}) => {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onEdit?.(product);
        onClose?.();
      }}
      className="w-full px-3 py-2 text-sm font-medium text-echo-black dark:text-white hover:bg-echo-blue/10 dark:hover:bg-echo-blue/20 rounded-lg flex items-center gap-2.5 transition-colors group"
    >
      <span className="material-symbols-outlined text-[20px] text-echo-gray dark:text-gray-400 group-hover:text-echo-blue dark:group-hover:text-echo-blue transition-colors">
        edit
      </span>
      Editar
    </button>
  );
};

export default ProductEditAction;
