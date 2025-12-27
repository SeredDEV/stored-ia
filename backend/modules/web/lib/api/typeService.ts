// Si estamos en el navegador, usar ruta relativa para aprovechar el proxy de Next.js
// Si estamos en el servidor (SSR), usar la URL completa
const API_URL =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
    : ""; // En el navegador, usar ruta relativa

export interface TypeAPI {
  id: string;
  valor: string;
  metadatos?: Record<string, any> | null;
  fecha_creacion: string;
  fecha_actualizacion: string;
  fecha_eliminacion?: string | null;
}

export interface CreateTypeInput {
  valor: string;
  metadatos?: Record<string, any>;
}

export interface UpdateTypeInput extends CreateTypeInput {}

export interface ApiResponse<T> {
  data: T;
}

export interface ApiError {
  error: string;
  dictionaryId?: string | number;
  stack?: string;
}

export const typeService = {
  // Obtener todos los tipos
  async getAll(): Promise<TypeAPI[]> {
    try {
      const response = await fetch(`${API_URL}/api/tipos`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.error || "Error al obtener los tipos");
      }

      const result: ApiResponse<TypeAPI[]> = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error fetching types:", error);
      throw error;
    }
  },

  // Obtener un tipo por ID
  async getById(id: string): Promise<TypeAPI> {
    try {
      const response = await fetch(`${API_URL}/api/tipos/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.error || "Error al obtener el tipo");
      }

      const result: ApiResponse<TypeAPI> = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error fetching type:", error);
      throw error;
    }
  },

  // Crear un nuevo tipo
  async create(data: CreateTypeInput): Promise<TypeAPI> {
    try {
      const response = await fetch(`${API_URL}/api/tipos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.error || "Error al crear el tipo");
      }

      const result: ApiResponse<TypeAPI> = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error creating type:", error);
      throw error;
    }
  },

  // Actualizar un tipo
  async update(id: string, data: UpdateTypeInput): Promise<TypeAPI> {
    try {
      const response = await fetch(`${API_URL}/api/tipos/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.error || "Error al actualizar el tipo");
      }

      const result: ApiResponse<TypeAPI> = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error updating type:", error);
      throw error;
    }
  },

  // Eliminar un tipo
  async delete(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/api/tipos/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.error || "Error al eliminar el tipo");
      }
    } catch (error) {
      console.error("Error deleting type:", error);
      throw error;
    }
  },
};
