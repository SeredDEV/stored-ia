import { SupabaseClient } from "@supabase/supabase-js";
import type { Variante } from "../productoVariante.model";

export interface IVarianteListService {
  execute(producto_id: string): Promise<Variante[]>;
}

export class VarianteListService implements IVarianteListService {
  constructor(private readonly supabaseClient: SupabaseClient) {}

  async execute(producto_id: string): Promise<Variante[]> {
    const { data, error } = await this.supabaseClient
      .from("variante_producto")
      .select("*")
      .eq("producto_id", producto_id)
      .is("fecha_eliminacion", null)
      .order("rango_variante", { ascending: true });

    if (error) {
      throw new Error(`Error al listar variantes: ${error.message}`);
    }

    return (data || []) as Variante[];
  }
}

