import { SupabaseClient } from "@supabase/supabase-js";
import type { Variante } from "../productoVariante.model";
import { generateErrorDictionary } from "./varianteGet.dictionary";

export interface IVarianteGetService {
  execute(id: string): Promise<Variante>;
}

export class VarianteGetService implements IVarianteGetService {
  constructor(private readonly supabaseClient: SupabaseClient) {}

  async execute(id: string): Promise<Variante> {
    const { data, error } = await this.supabaseClient
      .from("variante_producto")
      .select("*")
      .eq("id", id)
      .is("fecha_eliminacion", null)
      .single();

    if (error || !data) {
      const errorDict = generateErrorDictionary("NOT_FOUND");
      throw new Error(JSON.stringify(errorDict));
    }

    return data as Variante;
  }
}

