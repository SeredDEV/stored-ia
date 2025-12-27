// Tipos de la API
export interface CollectionAPI {
  id: string;
  titulo: string;
  slug: string;
  metadatos?: Record<string, any> | null;
  fecha_creacion: string;
  fecha_actualizacion: string;
  fecha_eliminacion?: string | null;
}

// Tipo para el frontend (legacy, mantener para compatibilidad)
export interface Collection {
  id: string;
  title: string;
  slug: string; // "Manejo"
  productsCount: number;
  createdAt: string;
  updatedAt: string;
}

export type CreateCollectionInput = Omit<
  Collection,
  "id" | "createdAt" | "updatedAt" | "productsCount"
>;

// Funciones de transformación
export function apiToCollection(apiCollection: CollectionAPI): Collection {
  return {
    id: apiCollection.id,
    title: apiCollection.titulo,
    slug: apiCollection.slug,
    productsCount: 0, // TODO: Obtener del backend
    createdAt: apiCollection.fecha_creacion,
    updatedAt: apiCollection.fecha_actualizacion,
  };
}

export function collectionToApi(collection: CreateCollectionInput): {
  titulo: string;
  slug?: string;
} {
  return {
    titulo: collection.title,
    slug: collection.slug,
  };
}
