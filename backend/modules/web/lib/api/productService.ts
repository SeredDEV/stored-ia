const API_URL = typeof window === "undefined" ? "http://localhost:3001" : "";

export interface ApiProduct {
  id: string;
  titulo: string;
  subtitulo: string | null;
  descripcion: string | null;
  slug: string;
  id_externo: string | null;
  estado: "borrador" | "publicado" | "inactivo";
  es_tarjeta_regalo: boolean;
  tiene_descuento: boolean;
  miniatura: string | null;
  peso: number | null;
  largo: number | null;
  alto: number | null;
  ancho: number | null;
  pais_origen: string | null;
  codigo_hs: string | null;
  codigo_mid: string | null;
  material: string | null;
  tipo_producto_id: string | null;
  coleccion_id: string | null;
  metadatos: any | null;
  fecha_creacion: string;
  fecha_actualizacion: string;
  fecha_eliminacion: string | null;
}

export const productService = {
  async getAll(): Promise<ApiProduct[]> {
    const response = await fetch(`${API_URL}/api/productos`);
    if (!response.ok) {
      throw new Error("Error al obtener productos");
    }
    const result = await response.json();
    return result.data;
  },

  async getById(id: string): Promise<ApiProduct> {
    const response = await fetch(`${API_URL}/api/productos/${id}`);
    if (!response.ok) {
      throw new Error("Error al obtener producto");
    }
    const result = await response.json();
    return result.data;
  },

  async create(product: Partial<ApiProduct>): Promise<ApiProduct> {
    const response = await fetch(`${API_URL}/api/productos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      throw new Error("Error al crear producto");
    }
    const result = await response.json();
    return result.data;
  },

  async update(id: string, product: Partial<ApiProduct>): Promise<ApiProduct> {
    const response = await fetch(`${API_URL}/api/productos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      throw new Error("Error al actualizar producto");
    }
    const result = await response.json();
    return result.data;
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/api/productos/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Error al eliminar producto");
    }
  },
};
