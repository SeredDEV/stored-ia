export interface Collection {
  id: string;
  title: string;
  slug: string; // "Manejo"
  productsCount: number;
  createdAt: string;
  updatedAt: string;
}

export type CreateCollectionInput = Omit<Collection, 'id' | 'createdAt' | 'updatedAt' | 'productsCount'>;
