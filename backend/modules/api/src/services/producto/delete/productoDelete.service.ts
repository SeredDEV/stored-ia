import { SupabaseClient } from "@supabase/supabase-js";
import { productoDeleteDictionary } from "./productoDelete.dictionary";

export interface IProductoDeleteService {
  execute(id: string): Promise<void>;
}

export class ProductoDeleteService implements IProductoDeleteService {
  constructor(private readonly supabaseClient: SupabaseClient) {}

  async execute(id: string): Promise<void> {
    // Verificar que el producto existe
    const { data: existing, error: existingError } = await this.supabaseClient
      .from("producto")
      .select("id")
      .eq("id", id)
      .neq("estado", "eliminado")
      .single();

    if (existingError || !existing) {
      throw new Error(productoDeleteDictionary.notFound.defaultMessage);
    }

    // Soft delete - cambiar estado a "eliminado"
    const { error } = await this.supabaseClient
      .from("producto")
      .update({
        estado: "inactivo", // Cambiar a inactivo en lugar de eliminar
        fecha_actualizacion: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      throw new Error(productoDeleteDictionary.errorDeleting.defaultMessage);
    }
  }
}
