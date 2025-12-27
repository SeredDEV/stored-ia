// Tipos de la API
export interface TagAPI {
  id: string;
  valor: string;
  metadatos?: Record<string, any> | null;
  fecha_creacion: string;
  fecha_actualizacion: string;
  fecha_eliminacion?: string | null;
}

// Tipo para el frontend (legacy, mantener para compatibilidad)
export interface ProductTag {
  id: string;
  name: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductTagInput {
  name: string;
  color?: string;
}

// Funciones de transformación
export function apiToTag(apiTag: TagAPI): ProductTag {
  return {
    id: apiTag.id,
    name: apiTag.valor,
    color: apiTag.metadatos?.color || "#6B7280",
    createdAt: apiTag.fecha_creacion,
    updatedAt: apiTag.fecha_actualizacion,
  };
}

export function tagToApi(tag: CreateProductTagInput): {
  valor: string;
  metadatos?: Record<string, any>;
} {
  return {
    valor: tag.name,
    metadatos: tag.color ? { color: tag.color } : undefined,
  };
}
