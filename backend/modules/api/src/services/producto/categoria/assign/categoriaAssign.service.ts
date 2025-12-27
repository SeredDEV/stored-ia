import { SupabaseClient } from "@supabase/supabase-js";
import {
  categoriaAssignDictionary,
  type ErrorDictionaryGenerator,
  type RValidationsNamesCategoriaAssign,
} from "./categoriaAssign.dictionary";

export interface AssignCategoriasInput {
  producto_id: string;
  categoria_ids: string[];
}

export interface ICategoriaAssignService {
  execute(input: AssignCategoriasInput): Promise<void>;
}

export class CategoriaAssignService implements ICategoriaAssignService {
  constructor(
    private readonly supabaseClient: SupabaseClient,
    private readonly errorDictionaryGenerator?: ErrorDictionaryGenerator<RValidationsNamesCategoriaAssign>
  ) {}

  async execute(input: AssignCategoriasInput): Promise<void> {
    const { producto_id, categoria_ids } = input;

    // 1. Verificar que el producto existe
    const { data: producto, error: productoError } = await this.supabaseClient
      .from("producto")
      .select("id")
      .eq("id", producto_id)
      .single();

    if (productoError || !producto) {
      throw new Error(
        categoriaAssignDictionary.productoNotFound.defaultMessage
      );
    }

    // 2. Eliminar las categorías actuales del producto
    const { error: deleteError } = await this.supabaseClient
      .from("categoria_producto_producto")
      .delete()
      .eq("producto_id", producto_id);

    if (deleteError) {
      throw new Error(categoriaAssignDictionary.errorDeleting.defaultMessage);
    }

    // 3. Si hay nuevas categorías, insertarlas
    if (categoria_ids.length > 0) {
      const records = categoria_ids.map((categoria_id) => ({
        producto_id,
        categoria_producto_id: categoria_id,
      }));

      const { error: insertError } = await this.supabaseClient
        .from("categoria_producto_producto")
        .insert(records);

      if (insertError) {
        throw new Error(
          categoriaAssignDictionary.errorAssigning.defaultMessage
        );
      }
    }
  }
}
