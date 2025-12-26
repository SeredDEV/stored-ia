import { SupabaseClient } from "@supabase/supabase-js";
import {
  categoriaDeleteDictionary,
  type ErrorDictionaryGenerator,
  type RValidationsNamesCategoriaDelete,
} from "./categoriaDelete.dictionary";

export interface ICategoriaDeleteService {
  delete(id: string): Promise<void>;
}

export class CategoriaDeleteService implements ICategoriaDeleteService {
  constructor(
    private readonly supabaseClient: SupabaseClient,
    private readonly errorDictionaryGenerator?: ErrorDictionaryGenerator<RValidationsNamesCategoriaDelete>
  ) {}

  async delete(id: string): Promise<void> {
    // Verificar si la categoría existe
    const { data: categoria } = await this.supabaseClient
      .from("categoria_producto")
      .select("id")
      .eq("id", id)
      .is("fecha_eliminacion", null)
      .single();

    if (!categoria) {
      throw new Error(categoriaDeleteDictionary.notFound.defaultMessage);
    }

    // Verificar si tiene subcategorías
    const { data: children } = await this.supabaseClient
      .from("categoria_producto")
      .select("id")
      .eq("categoria_padre_id", id)
      .is("fecha_eliminacion", null)
      .limit(1);

    if (children && children.length > 0) {
      throw new Error(categoriaDeleteDictionary.hasChildren.defaultMessage);
    }

    // Eliminar (soft delete)
    const { error } = await this.supabaseClient
      .from("categoria_producto")
      .update({ fecha_eliminacion: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      throw new Error(categoriaDeleteDictionary.errorDeleting.defaultMessage);
    }
  }
}

