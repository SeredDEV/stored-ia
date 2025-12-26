export type CategoryStatus = 'Activa' | 'Inactiva';
export type CategoryVisibility = 'Pública' | 'Interna';

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
}

export interface CreateCategoryInput {
  name: string;
  slug: string;
  description?: string;
  status: CategoryStatus;
  visibility: CategoryVisibility;
}
