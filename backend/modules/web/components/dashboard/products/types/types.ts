// Tipos de la API
export interface TypeAPI {
  id: string;
  valor: string;
  metadatos?: Record<string, any> | null;
  fecha_creacion: string;
  fecha_actualizacion: string;
  fecha_eliminacion?: string | null;
}

// Tipo para el frontend (legacy, mantener para compatibilidad)
export interface ProductType {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductTypeInput {
  name: string;
}

// Funciones de transformación
export function apiToType(apiType: TypeAPI): ProductType {
  return {
    id: apiType.id,
    name: apiType.valor,
    createdAt: apiType.fecha_creacion,
    updatedAt: apiType.fecha_actualizacion,
  };
}

export function typeToApi(type: CreateProductTypeInput): {
  valor: string;
} {
  return {
    valor: type.name,
  };
}
