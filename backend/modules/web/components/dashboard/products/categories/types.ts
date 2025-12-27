export type CategoryStatus = "Activa" | "Inactiva";
export type CategoryVisibility = "Pública" | "Interna";

// Tipos de la API
export interface CategoryAPI {
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

// Tipo para el frontend (legacy, mantener para compatibilidad)
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  status: CategoryStatus;
  visibility: CategoryVisibility;
  productsCount: number;
  createdAt: string;
  updatedAt: string;
  parentId?: string | null;
  ranking?: number;
}

export interface CreateCategoryInput {
  name: string;
  slug?: string;
  description?: string;
  status: CategoryStatus;
  visibility: CategoryVisibility;
  parentId?: string;
  ranking?: number;
}

// Funciones de transformación
export function apiToCategory(apiCategory: CategoryAPI): Category {
  return {
    id: apiCategory.id,
    name: apiCategory.nombre,
    slug: apiCategory.slug,
    description: apiCategory.descripcion,
    status: apiCategory.activa ? "Activa" : "Inactiva",
    visibility: apiCategory.interna ? "Interna" : "Pública",
    productsCount: 0, // TODO: Obtener del backend
    createdAt: apiCategory.fecha_creacion,
    updatedAt: apiCategory.fecha_actualizacion,
    parentId: apiCategory.categoria_padre_id,
    ranking: apiCategory.rango,
  };
}

export function categoryToApi(category: CreateCategoryInput): {
  nombre: string;
  descripcion?: string;
  slug?: string;
  categoria_padre_id?: string;
  rango?: number;
  activa?: boolean;
  interna?: boolean;
} {
  return {
    nombre: category.name,
    descripcion: category.description,
    slug: category.slug,
    categoria_padre_id: category.parentId,
    rango: category.ranking,
    activa: category.status === "Activa",
    interna: category.visibility === "Interna",
  };
}
