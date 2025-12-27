// Si estamos en el navegador, usar ruta relativa para aprovechar el proxy de Next.js
// Si estamos en el servidor (SSR), usar la URL completa
const API_URL =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
    : ""; // En el navegador, usar ruta relativa

export interface Category {
  id: string;
  nombre: string;
  descripcion?: string;
  slug: string;
  categoria_padre_id?: string | null;
  ruta_materializada?: string | null;
  rango: number;
  activa: boolean;
  interna: boolean;
  metadatos?: Record<string, any> | null;
  fecha_creacion: string;
  fecha_actualizacion: string;
  fecha_eliminacion?: string | null;
}

export interface CreateCategoryInput {
  nombre: string;
  descripcion?: string;
  slug?: string;
  categoria_padre_id?: string;
  rango?: number;
  activa?: boolean;
  interna?: boolean;
  metadatos?: Record<string, any>;
}

export interface UpdateCategoryInput extends CreateCategoryInput {}

export interface ApiResponse<T> {
  data: T;
}

export interface ApiError {
  error: string;
  dictionaryId?: number;
  stack?: string;
}

export const categoryService = {
  // Obtener todas las categorías
  async getAll(): Promise<Category[]> {
    try {
      const response = await fetch(`${API_URL}/api/categorias`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.error || "Error al obtener las categorías");
      }

      const result: ApiResponse<Category[]> = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  },

  // Obtener una categoría por ID
  async getById(id: string): Promise<Category> {
    try {
      const response = await fetch(`${API_URL}/api/categorias/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.error || "Error al obtener la categoría");
      }

      const result: ApiResponse<Category> = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error fetching category:", error);
      throw error;
    }
  },

  // Crear una nueva categoría
  async create(data: CreateCategoryInput): Promise<Category> {
    try {
      const response = await fetch(`${API_URL}/api/categorias`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.error || "Error al crear la categoría");
      }

      const result: ApiResponse<Category> = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  },

  // Actualizar una categoría
  async update(id: string, data: UpdateCategoryInput): Promise<Category> {
    try {
      const response = await fetch(`${API_URL}/api/categorias/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.error || "Error al actualizar la categoría");
      }

      const result: ApiResponse<Category> = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  },

  // Eliminar una categoría
  async delete(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/api/categorias/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.error || "Error al eliminar la categoría");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error;
    }
  },
};
