import { SupabaseClient } from "@supabase/supabase-js";
import type { Producto } from "../productoModel";

export interface ListProductosFilters {
  activo?: boolean;
  tiene_variantes?: boolean;
  tipo_producto_id?: string;
  coleccion_id?: string;
}

export interface IProductoListService {
  execute(filters?: ListProductosFilters): Promise<Producto[]>;
}

export class ProductoListService implements IProductoListService {
  constructor(private readonly supabaseClient: SupabaseClient) {}

  async execute(filters?: ListProductosFilters): Promise<Producto[]> {
    let query = this.supabaseClient
      .from("producto")
      .select("*")
      .eq("estado", "publicado") // Solo listar productos publicados
      .order("fecha_creacion", { ascending: false });

    // Filtro por estado en lugar de activo
    if (filters?.activo !== undefined) {
      // Si se pide activos, filtrar por estado publicado
      if (filters.activo) {
        query = query.eq("estado", "publicado");
      } else {
        query = query.in("estado", ["borrador", "inactivo"]);
      }
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

    const { data, error } = await query;

    if (error) {
      throw new Error(`Error al listar productos: ${error.message}`);
    }

    return data || [];
  }
}
