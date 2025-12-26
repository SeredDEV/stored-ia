/**
 * Interfaces y tipos para el servicio de colecciones de productos
 */

export interface CreateColeccionInput {
  titulo: string;
  slug?: string;
  metadatos?: Record<string, any>;
}

export interface Coleccion {
  id: string;
  titulo: string;
  slug?: string;
  metadatos?: Record<string, any>;
  fecha_creacion: string;
  fecha_actualizacion: string;
  fecha_eliminacion?: string;
}

export interface IProductoColeccionService {
  createColeccion(input: CreateColeccionInput): Promise<Coleccion>;
  getColeccion(id: string): Promise<Coleccion>;
  getColeccionBySlug(slug: string): Promise<Coleccion | null>;
  listColecciones(): Promise<Coleccion[]>;
  updateColeccion(
    id: string,
    input: Partial<CreateColeccionInput>
  ): Promise<Coleccion>;
  deleteColeccion(id: string): Promise<void>;
}

