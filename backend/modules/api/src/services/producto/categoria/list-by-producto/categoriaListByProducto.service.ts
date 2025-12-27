import { SupabaseClient } from "@supabase/supabase-js";
import type { Categoria } from "../productoCategoria.model";

export interface ICategoriaListByProductoService {
  execute(producto_id: string): Promise<Categoria[]>;
}

export class CategoriaListByProductoService
  implements ICategoriaListByProductoService
{
  constructor(private readonly supabaseClient: SupabaseClient) {}

  async execute(producto_id: string): Promise<Categoria[]> {
    // Verificar que el producto existe
    const { data: producto, error: productoError } = await this.supabaseClient
      .from("producto")
      .select("id")
      .eq("id", producto_id)
      .single();

    if (productoError || !producto) {
      throw new Error(`Producto con id ${producto_id} no encontrado`);
    }

    // Obtener las categorías del producto
    const { data, error } = await this.supabaseClient
      .from("categoria_producto_producto")
      .select(
        `
        categoria_producto_id,
        categoria_producto:categoria_producto_id (*)
      `
      )
      .eq("producto_id", producto_id);

    if (error) {
      throw new Error(
        `Error al obtener categorías del producto: ${error.message}`
      );
    }

    // Mapear los resultados para retornar solo las categorías
    return (data || [])
      .map((item: any) => item.categoria_producto)
      .filter(Boolean);
  }
}
