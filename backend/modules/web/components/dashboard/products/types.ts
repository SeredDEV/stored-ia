export interface Product {
  id: string;
  name: string;
  icon: string;
  image?: string;
  collection: string;
  salesChannel: string;
  variants: number;
  status: "Publicado" | "Borrador" | "Inactivo";
}

// API Types
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
  variantes?: { count: number }[];
}

// Transformation functions
export const apiToProduct = (apiProduct: ApiProduct): Product => {
  const statusMap: Record<string, "Publicado" | "Borrador" | "Inactivo"> = {
    publicado: "Publicado",
    borrador: "Borrador",
    inactivo: "Inactivo",
  };

  return {
    id: apiProduct.id,
    name: apiProduct.titulo,
    icon: "📦", // Default icon
    image: apiProduct.miniatura || undefined,
    collection: "N/A", // TODO: fetch collection name
    salesChannel: "Todos", // Default
    variants: apiProduct.variantes?.[0]?.count || 0,
    status: statusMap[apiProduct.estado] || "Borrador",
  };
};
