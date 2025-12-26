import { SupabaseClient } from "@supabase/supabase-js";
import type { TipoProducto } from "../productoTipo.model";

export interface ITipoListService {
  execute(): Promise<TipoProducto[]>;
}

export class TipoListService implements ITipoListService {
  constructor(private readonly supabaseClient: SupabaseClient) {}

  async execute(): Promise<TipoProducto[]> {
    const { data, error } = await this.supabaseClient
      .from("tipo_producto")
      .select("*")
      .is("fecha_eliminacion", null)
      .order("valor", { ascending: true });

    if (error) {
      throw new Error(`Error al listar tipos de productos: ${error.message}`);
    }

    return (data || []) as TipoProducto[];
  }
}

