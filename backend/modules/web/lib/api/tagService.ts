// Si estamos en el navegador, usar ruta relativa para aprovechar el proxy de Next.js
// Si estamos en el servidor (SSR), usar la URL completa
const API_URL =
  typeof window === "undefined"
    ? process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
    : ""; // En el navegador, usar ruta relativa

export interface Tag {
  id: string;
  valor: string;
  metadatos?: Record<string, any> | null;
  fecha_creacion: string;
  fecha_actualizacion: string;
  fecha_eliminacion?: string | null;
}

export interface CreateTagInput {
  valor: string;
  metadatos?: Record<string, any>;
}

export interface UpdateTagInput extends CreateTagInput {}

export interface ApiResponse<T> {
  data: T;
}

export interface ApiError {
  error: string;
  dictionaryId?: string | number;
  stack?: string;
}

export const tagService = {
  // Obtener todas las etiquetas
  async getAll(): Promise<Tag[]> {
    try {
      const response = await fetch(`${API_URL}/api/etiquetas`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.error || "Error al obtener las etiquetas");
      }

      const result: ApiResponse<Tag[]> = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error fetching tags:", error);
      throw error;
    }
  },

  // Obtener una etiqueta por ID
  async getById(id: string): Promise<Tag> {
    try {
      const response = await fetch(`${API_URL}/api/etiquetas/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.error || "Error al obtener la etiqueta");
      }

      const result: ApiResponse<Tag> = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error fetching tag:", error);
      throw error;
    }
  },

  // Crear una nueva etiqueta
  async create(data: CreateTagInput): Promise<Tag> {
    try {
      const response = await fetch(`${API_URL}/api/etiquetas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.error || "Error al crear la etiqueta");
      }

      const result: ApiResponse<Tag> = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error creating tag:", error);
      throw error;
    }
  },

  // Actualizar una etiqueta
  async update(id: string, data: UpdateTagInput): Promise<Tag> {
    try {
      const response = await fetch(`${API_URL}/api/etiquetas/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.error || "Error al actualizar la etiqueta");
      }

      const result: ApiResponse<Tag> = await response.json();
      return result.data;
    } catch (error) {
      console.error("Error updating tag:", error);
      throw error;
    }
  },

  // Eliminar una etiqueta
  async delete(id: string): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/api/etiquetas/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const error: ApiError = await response.json();
        throw new Error(error.error || "Error al eliminar la etiqueta");
      }
    } catch (error) {
      console.error("Error deleting tag:", error);
      throw error;
    }
  },
};
