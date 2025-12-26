import { SupabaseClient } from "@supabase/supabase-js";
import type { Categoria } from "../productoCategoria.model";
import {
  categoriaGetDictionary,
  type ErrorDictionaryGenerator,
  type RValidationsNamesCategoriaGet,
} from "./categoriaGet.dictionary";

export interface ICategoriaGetService {
  execute(id: string): Promise<Categoria>;
}

export class CategoriaGetService implements ICategoriaGetService {
  constructor(
    private readonly supabaseClient: SupabaseClient,
    private readonly errorDictionaryGenerator?: ErrorDictionaryGenerator<RValidationsNamesCategoriaGet>
  ) {}

  async execute(id: string): Promise<Categoria> {
    const { data, error } = await this.supabaseClient
      .from("categoria_producto")
      .select("*")
      .eq("id", id)
      .is("fecha_eliminacion", null)
      .single();

    if (error || !data) {
      throw new Error(JSON.stringify(categoriaGetDictionary.notFound));
    }

    return data;
  }
}
