import { SupabaseClient } from "@supabase/supabase-js";
import {
  categoriaRemoveDictionary,
  type ErrorDictionaryGenerator,
  type RValidationsNamesCategoriaRemove,
} from "./categoriaRemove.dictionary";

export interface RemoveCategoriaInput {
  producto_id: string;
  categoria_id: string;
}

export interface ICategoriaRemoveService {
  execute(input: RemoveCategoriaInput): Promise<void>;
}

export class CategoriaRemoveService implements ICategoriaRemoveService {
  constructor(
    private readonly supabaseClient: SupabaseClient,
    private readonly errorDictionaryGenerator?: ErrorDictionaryGenerator<RValidationsNamesCategoriaRemove>
  ) {}

  async execute(input: RemoveCategoriaInput): Promise<void> {
    const { producto_id, categoria_id } = input;

    // Verificar que el producto existe
    const { data: producto, error: productoError } = await this.supabaseClient
      .from("producto")
      .select("id")
      .eq("id", producto_id)
      .single();

    if (productoError || !producto) {
      throw new Error(
        categoriaRemoveDictionary.productoNotFound.defaultMessage
      );
    }

    // Verificar que la relación existe
    const { data: relacion, error: relacionError } = await this.supabaseClient
      .from("categoria_producto_producto")
      .select("*")
      .eq("producto_id", producto_id)
      .eq("categoria_producto_id", categoria_id)
      .single();

    if (relacionError || !relacion) {
      throw new Error(
        categoriaRemoveDictionary.categoriaNotFound.defaultMessage
      );
    }

    // Eliminar la relación
    const { error: deleteError } = await this.supabaseClient
      .from("categoria_producto_producto")
      .delete()
      .eq("producto_id", producto_id)
      .eq("categoria_producto_id", categoria_id);

    if (deleteError) {
      throw new Error(categoriaRemoveDictionary.errorRemoving.defaultMessage);
    }
  }
}
