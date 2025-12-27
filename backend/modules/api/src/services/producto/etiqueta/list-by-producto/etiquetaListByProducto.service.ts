import { SupabaseClient } from "@supabase/supabase-js";
import type { Etiqueta } from "../productoEtiqueta.model";

export interface IEtiquetaListByProductoService {
  execute(producto_id: string): Promise<Etiqueta[]>;
}

export class EtiquetaListByProductoService implements IEtiquetaListByProductoService {
  constructor(private readonly supabaseClient: SupabaseClient) {}

  async execute(producto_id: string): Promise<Etiqueta[]> {
    // Verificar que el producto existe
    const { data: producto, error: productoError } = await this.supabaseClient
      .from("producto")
      .select("id")
      .eq("id", producto_id)
      .single();

    if (productoError || !producto) {
      throw new Error(`Producto con id ${producto_id} no encontrado`);
    }

    // Obtener las etiquetas del producto
    const { data, error } = await this.supabaseClient
      .from("producto_etiquetas")
      .select(`
        etiqueta_producto_id,
        etiqueta_producto:etiqueta_producto_id (*)
      `)
      .eq("producto_id", producto_id);

    if (error) {
      throw new Error(`Error al obtener etiquetas del producto: ${error.message}`);
    }

    // Mapear los resultados para retornar solo las etiquetas
    return (data || []).map((item: any) => item.etiqueta_producto).filter(Boolean);
  }
}
