const API_URL =
  typeof window === "undefined" ? "http://localhost:3001" : "/api";

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
  async getAll(
    estado?: "publicado" | "borrador" | "inactivo"
  ): Promise<ApiProduct[]> {
    let url = `${API_URL}/productos`;
    if (estado) {
      url += `?estado=${estado}`;
    }
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Error al obtener productos");
    }
    const result = await response.json();
    return result.data;
  },

  async getById(id: string): Promise<ApiProduct> {
    const response = await fetch(`${API_URL}/productos/${id}`);
    if (!response.ok) {
      throw new Error("Error al obtener producto");
    }
    const result = await response.json();
    return result.data;
  },

  async create(product: Partial<ApiProduct>): Promise<ApiProduct> {
    const response = await fetch(`${API_URL}/productos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      let errorMessage = "Error al crear producto";
      try {
        // Intentar parsear como JSON
        const error = await response.json();
        console.error("Error del servidor:", error);
        errorMessage = error.error || error.message || JSON.stringify(error);
      } catch (e) {
        // Si falla el JSON, usar el statusText
        console.error(
          "Error del servidor (sin JSON):",
          response.status,
          response.statusText
        );
        errorMessage = `Error ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }
    const result = await response.json();
    return result.data.producto; // Backend devuelve { data: { producto: {...} } }
  },

  async createWithImages(formData: FormData): Promise<ApiProduct> {
    const response = await fetch(`${API_URL}/productos`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    if (!response.ok) {
      let errorMessage = "Error al crear producto";
      try {
        const error = await response.json();
        console.error("Error del servidor:", error);
        errorMessage = error.error || error.message || JSON.stringify(error);
      } catch (e) {
        // Si no se puede parsear el JSON, usar el texto de la respuesta
        const text = await response.text();
        console.error("Error del servidor (texto):", text);
        errorMessage =
          text || `Error ${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }
    const result = await response.json();
    return result.data.producto;
  },

  async update(id: string, product: Partial<ApiProduct>): Promise<ApiProduct> {
    const response = await fetch(`${API_URL}/productos/${id}`, {
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

  // Asignar categorías a un producto
  async assignCategories(
    productId: string,
    categoryIds: string[]
  ): Promise<void> {
    const response = await fetch(
      `${API_URL}/productos/${productId}/categorias`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ categoria_ids: categoryIds }),
      }
    );
    if (!response.ok) {
      throw new Error("Error al asignar categorías");
    }
  },

  // Asignar etiquetas a un producto
  async assignTags(productId: string, tagIds: string[]): Promise<void> {
    const response = await fetch(
      `${API_URL}/productos/${productId}/etiquetas`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ etiqueta_ids: tagIds }),
      }
    );
    if (!response.ok) {
      throw new Error("Error al asignar etiquetas");
    }
  },

  // Subir imágenes a un producto
  // TODO: Implementar endpoint POST /api/productos/:id/imagenes en el backend
  async uploadImages(productId: string, images: File[]): Promise<void> {
    const formData = new FormData();
    images.forEach((image, index) => {
      formData.append(`imagenes`, image);
    });

    const response = await fetch(`${API_URL}/productos/${productId}/imagenes`, {
      method: "POST",
      body: formData, // No incluir Content-Type, el browser lo añade automáticamente con boundary
    });
    if (!response.ok) {
      throw new Error("Error al subir imágenes");
    }
  },

  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_URL}/productos/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Error al eliminar producto");
    }
  },

  // Crear variante
  async createVariant(variantData: {
    producto_id: string;
    titulo: string;
    sku: string;
    gestionar_inventario?: boolean;
    permitir_pedido_pendiente?: boolean;
  }): Promise<any> {
    const response = await fetch(`${API_URL}/variantes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(variantData),
    });
    if (!response.ok) {
      throw new Error("Error al crear variante");
    }
    const result = await response.json();
    return result.data;
  },

  // Crear precio para variante
  async createPrice(
    variantId: string,
    priceData: {
      variante_id: string;
      monto: number;
      codigo_moneda: string;
    }
  ): Promise<any> {
    const response = await fetch(`${API_URL}/variantes/${variantId}/precios`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(priceData),
    });
    if (!response.ok) {
      throw new Error("Error al crear precio");
    }
    const result = await response.json();
    return result.data;
  },
};
