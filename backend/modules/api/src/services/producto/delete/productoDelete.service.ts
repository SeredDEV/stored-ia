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
      .is("fecha_eliminacion", null)
      .single();

    if (existingError || !existing) {
      throw new Error(productoDeleteDictionary.notFound.defaultMessage);
    }

    // Hard delete: deja que las FKs ON DELETE CASCADE borren variantes/precios/relaciones
    const { error } = await this.supabaseClient
      .from("producto")
      .delete()
      .eq("id", id);

    if (error) {
      throw new Error(productoDeleteDictionary.errorDeleting.defaultMessage);
    }
  }
}
