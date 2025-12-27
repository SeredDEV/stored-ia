// Si estamos en el navegador, usar ruta relativa para aprovechar el proxy de Next.js
// Si estamos en el servidor (SSR), usar la URL completa
const API_URL =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
    : ""; // En el navegador, usar ruta relativa

export interface CollectionAPI {
  id: string;
  titulo: string;
  slug: string;
  metadatos?: Record<string, any> | null;
  fecha_creacion: string;
  fecha_actualizacion: string;
  fecha_eliminacion?: string | null;
}

export interface CreateCollectionInput {
  titulo: string;
  slug?: string;
  metadatos?: Record<string, any>;
}

export interface UpdateCollectionInput extends CreateCollectionInput {}

export interface ApiResponse<T> {
  data: T;
}

export interface ApiError {
  error: string;
  dictionaryId?: string | number;
  stack?: string;
}

export const collectionService = {
  // Obtener todas las colecciones
  async getAll(): Promise<CollectionAPI[]> {
    try {
      const response = await fetch(`${API_URL}/api/colecciones`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.error || "Error al obtener las colecciones");
      }

      const result: ApiResponse<CollectionAPI[]> = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error fetching collections:", error);
      throw error;
    }
  },

  // Obtener una colección por ID
  async getById(id: string): Promise<CollectionAPI> {
    try {
      const response = await fetch(`${API_URL}/api/colecciones/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.error || "Error al obtener la colección");
      }

      const result: ApiResponse<CollectionAPI> = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error fetching collection:", error);
      throw error;
    }
  },

  // Crear una nueva colección
  async create(data: CreateCollectionInput): Promise<CollectionAPI> {
    try {
      const response = await fetch(`${API_URL}/api/colecciones`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.error || "Error al crear la colección");
      }

      const result: ApiResponse<CollectionAPI> = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error creating collection:", error);
      throw error;
    }
  },

  // Actualizar una colección
  async update(
    id: string,
    data: UpdateCollectionInput
  ): Promise<CollectionAPI> {
    try {
      const response = await fetch(`${API_URL}/api/colecciones/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.error || "Error al actualizar la colección");
      }

      const result: ApiResponse<CollectionAPI> = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error updating collection:", error);
      throw error;
    }
  },

  // Eliminar una colección
  async delete(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/api/colecciones/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.error || "Error al eliminar la colección");
      }
    } catch (error) {
      console.error("Error deleting collection:", error);
      throw error;
    }
  },
};
