"use client";
import React, { useState } from "react";

interface Product {
  id: string;
  name: string;
  icon: string;
  collection: string;
  salesChannel: string;
  variants: number;
  status: "Publicado" | "Borrador";
}

const products: Product[] = [
  {
    id: "1",
    name: "Medusa Sweatpants",
    icon: "checkroom",
    collection: "-",
    salesChannel: "Default Sales Channel",
    variants: 4,
    status: "Publicado",
  },
  {
    id: "2",
    name: "Medusa Jeans",
    icon: "checkroom",
    collection: "-",
    salesChannel: "Default Sales Channel",
    variants: 5,
    status: "Publicado",
  },
  {
    id: "3",
    name: "Medusa Sweatshirt",
    icon: "checkroom",
    collection: "-",
    salesChannel: "Default Sales Channel",
    variants: 4,
    status: "Publicado",
  },
  {
    id: "4",
    name: "Medusa Hoodie",
    icon: "checkroom",
    collection: "-",
    salesChannel: "Default Sales Channel",
    variants: 5,
    status: "Publicado",
  },
  {
    id: "5",
    name: "Medusa T-Shirt",
    icon: "checkroom",
    collection: "-",
    salesChannel: "Default Sales Channel",
    variants: 8,
    status: "Publicado",
  },
  {
    id: "6",
    name: "Medusa Backpack",
    icon: "backpack",
    collection: "-",
    salesChannel: "Default Sales Channel",
    variants: 3,
    status: "Publicado",
  },
  {
    id: "7",
    name: "Medusa Watch",
    icon: "watch",
    collection: "-",
    salesChannel: "Default Sales Channel",
    variants: 3,
    status: "Publicado",
  },
  {
    id: "8",
    name: "Echo Dot",
    icon: "speaker",
    collection: "-",
    salesChannel: "Default Sales Channel",
    variants: 3,
    status: "Publicado",
  },
];

const ProductsManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 11;
  const totalProducts = products.length;

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (productId: string) => {
    console.log("Edit product:", productId);
  };

  const handleDelete = (productId: string) => {
    console.log("Delete product:", productId);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">
            Gestión de Productos
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Administra el catálogo de productos de tu tienda.
          </p>
        </div>
        <button className="bg-echo-blue dark:bg-primary hover:bg-echo-blue-variant dark:hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all active:scale-95 font-medium">
          <span className="material-symbols-outlined text-sm">add</span>
          Nuevo Producto
        </button>
      </div>

      {/* Action Bar */}
      <div className="bg-white dark:bg-surface-dark rounded-t-xl p-4 border border-gray-200 dark:border-gray-700 border-b-0 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <button className="hidden md:block text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm font-medium px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            Agregar filtro
          </button>

          <div className="relative flex-1 w-full">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <span className="material-symbols-outlined text-xl">search</span>
            </span>
            <input
              type="text"
              placeholder="Buscar"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-echo-blue dark:focus:ring-primary focus:border-transparent dark:text-gray-200 dark:placeholder-gray-500 transition-shadow"
            />
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <button className="flex-1 md:flex-none text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm font-medium px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              Exportar
            </button>
            <button className="flex-1 md:flex-none text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm font-medium px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              Importar
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-b-xl shadow-sm overflow-hidden hidden md:block">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">
              <th className="px-6 py-4">PRODUCTO</th>
              <th className="px-6 py-4">COLECCIÓN</th>
              <th className="px-6 py-4">CANALES DE VENTA</th>
              <th className="px-6 py-4">VARIANTES</th>
              <th className="px-6 py-4">ESTADO</th>
              <th className="px-6 py-4 text-right">ACCIONES</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredProducts.map((product) => (
              <tr
                key={product.id}
                className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                      <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">
                        {product.icon}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {product.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                  {product.collection}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                  {product.salesChannel}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                  {product.variants} variantes
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      {product.status}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1">
                    <span className="material-symbols-outlined text-lg">
                      more_vert
                    </span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between bg-white dark:bg-surface-dark">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {currentPage === 1 ? 1 : (currentPage - 1) * itemsPerPage + 1}-
            {Math.min(currentPage * itemsPerPage, totalProducts)} de{" "}
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {totalProducts}
            </span>{" "}
            resultados
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {Math.ceil(totalProducts / itemsPerPage)} de{" "}
              {Math.ceil(totalProducts / itemsPerPage)} páginas
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Anterior
              </button>
              <button
                onClick={() => setCurrentPage((p) => p + 1)}
                disabled={currentPage * itemsPerPage >= totalProducts}
                className="px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">
                    {product.icon}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {product.variants} variantes
                  </p>
                </div>
              </div>
              <button className="text-gray-400">
                <span className="material-symbols-outlined">more_vert</span>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {product.status}
                </span>
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {product.salesChannel}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsManagement;
