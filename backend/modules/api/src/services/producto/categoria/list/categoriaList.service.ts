import { SupabaseClient } from "@supabase/supabase-js";
import type { Categoria, ListCategoriasFilters } from "../productoCategoria.model";

export interface ICategoriaListService {
  list(filters?: ListCategoriasFilters): Promise<Categoria[]>;
  getTree(): Promise<Categoria[]>;
}

export class CategoriaListService implements ICategoriaListService {
  constructor(private readonly supabaseClient: SupabaseClient) {}

  async list(filters?: ListCategoriasFilters): Promise<Categoria[]> {
    let query = this.supabaseClient
      .from("categoria_producto")
      .select("*")
      .is("fecha_eliminacion", null)
      .order("rango", { ascending: true });

    if (filters?.activa !== undefined) {
      query = query.eq("activa", filters.activa);
    }

    if (filters?.categoria_padre_id !== undefined) {
      if (filters.categoria_padre_id === null) {
        query = query.is("categoria_padre_id", null);
      } else {
        query = query.eq("categoria_padre_id", filters.categoria_padre_id);
      }
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Error al listar categorías: ${error.message}`);
    }

    return data || [];
  }

  async getTree(): Promise<Categoria[]> {
    const { data, error } = await this.supabaseClient
      .from("categoria_producto")
      .select("*")
      .is("fecha_eliminacion", null)
      .order("rango", { ascending: true });

    if (error) {
      throw new Error(`Error al obtener árbol de categorías: ${error.message}`);
    }

    return data || [];
  }
}

