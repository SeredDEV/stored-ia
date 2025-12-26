/**
 * Interfaces y tipos para el servicio de categorías de productos
 */

export interface CreateCategoriaInput {
  nombre: string;
  descripcion?: string;
  slug?: string;
  categoria_padre_id?: string;
  rango?: number;
  activa?: boolean;
  interna?: boolean;
  metadatos?: Record<string, any>;
}

export interface Categoria {
  id: string;
  nombre: string;
  descripcion?: string;
  slug?: string;
  categoria_padre_id?: string;
  ruta_materializada?: string;
  rango: number;
  activa: boolean;
  interna: boolean;
  metadatos?: Record<string, any>;
  fecha_creacion: string;
  fecha_actualizacion: string;
  fecha_eliminacion?: string;
}

export interface ListCategoriasFilters {
  activa?: boolean;
  categoria_padre_id?: string | null;
}

export interface IProductoCategoriaService {
  createCategoria(input: CreateCategoriaInput): Promise<Categoria>;
  getCategoria(id: string): Promise<Categoria | null>;
  listCategorias(filters?: ListCategoriasFilters): Promise<Categoria[]>;
  updateCategoria(
    id: string,
    input: Partial<CreateCategoriaInput>
  ): Promise<Categoria>;
  deleteCategoria(id: string): Promise<void>;
  getCategoriaTree(): Promise<Categoria[]>;
}

