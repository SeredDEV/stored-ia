import { SupabaseClient } from "@supabase/supabase-js";
import type { CreateCategoriaInput, Categoria } from "../productoCategoria.model";
import {
  categoriaUpdateDictionary,
  type ErrorDictionaryGenerator,
  type RValidationsNamesCategoriaUpdate,
} from "./categoriaUpdate.dictionary";

export interface ICategoriaUpdateService {
  update(id: string, input: Partial<CreateCategoriaInput>): Promise<Categoria>;
}

export class CategoriaUpdateService implements ICategoriaUpdateService {
  constructor(
    private readonly supabaseClient: SupabaseClient,
    private readonly errorDictionaryGenerator?: ErrorDictionaryGenerator<RValidationsNamesCategoriaUpdate>
  ) {}

  async update(
    id: string,
    input: Partial<CreateCategoriaInput>
  ): Promise<Categoria> {
    // Verificar si la categoría existe
    const { data: exists } = await this.supabaseClient
      .from("categoria_producto")
      .select("id")
      .eq("id", id)
      .is("fecha_eliminacion", null)
      .single();

    if (!exists) {
      throw new Error(categoriaUpdateDictionary.notFound.defaultMessage);
    }

    // Actualizar
    const { data, error } = await this.supabaseClient
      .from("categoria_producto")
      .update({
        ...input,
        fecha_actualizacion: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(categoriaUpdateDictionary.errorUpdating.defaultMessage);
    }

    return data;
  }
}

