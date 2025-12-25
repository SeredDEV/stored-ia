import { useState, useMemo } from "react";
import { Product } from "../types";

export const useProductFiltering = (products: Product[], itemsPerPage: number = 11) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = useMemo(() => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage, itemsPerPage]);

  // Reset page when search changes
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    filteredProducts, // Returning all filtered for mobile or other uses if needed
    paginatedProducts, // Current page items
    totalProducts,
    totalPages,
  };
};
