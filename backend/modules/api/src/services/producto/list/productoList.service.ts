import { SupabaseClient } from "@supabase/supabase-js";
import type { Producto } from "../productoModel";

export interface ListProductosFilters {
  activo?: boolean;
  tiene_variantes?: boolean;
  tipo_producto_id?: string;
  coleccion_id?: string;
  estado?: "borrador" | "publicado" | "inactivo";
}

export interface IProductoListService {
  execute(filters?: ListProductosFilters): Promise<Producto[]>;
}

export class ProductoListService implements IProductoListService {
  constructor(private readonly supabaseClient: SupabaseClient) {}

  async execute(filters?: ListProductosFilters): Promise<Producto[]> {
    let query = this.supabaseClient
      .from("producto")
      .select(`
        *,
        variantes:variante_producto(count),
        coleccion:coleccion_id(titulo)
      `)
      .is("fecha_eliminacion", null)
      .order("fecha_creacion", { ascending: false });

    if (filters?.activo !== undefined) {
      query = query.eq("activo", filters.activo);
    }

    if (filters?.tiene_variantes !== undefined) {
      query = query.eq("tiene_variantes", filters.tiene_variantes);
    }

    if (filters?.tipo_producto_id) {
      query = query.eq("tipo_producto_id", filters.tipo_producto_id);
    }

    if (filters?.coleccion_id) {
      query = query.eq("coleccion_id", filters.coleccion_id);
    }

    if (filters?.estado) {
      query = query.eq("estado", filters.estado);
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(`Error al listar productos: ${error.message}`);
    }

    return data || [];
  }
}
