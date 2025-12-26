import { SupabaseClient } from "@supabase/supabase-js";
import { generateErrorDictionary } from "./varianteDelete.dictionary";

export interface IVarianteDeleteService {
  execute(id: string): Promise<void>;
}

export class VarianteDeleteService implements IVarianteDeleteService {
  constructor(private readonly supabaseClient: SupabaseClient) {}

  async execute(id: string): Promise<void> {
    // Verificar que existe
    const { data: existing } = await this.supabaseClient
      .from("variante_producto")
      .select("*")
      .eq("id", id)
      .is("fecha_eliminacion", null)
      .single();

    if (!existing) {
      const error = generateErrorDictionary("NOT_FOUND");
      throw new Error(JSON.stringify(error));
    }

    const { error } = await this.supabaseClient
      .from("variante_producto")
      .update({ fecha_eliminacion: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      const errorDict = generateErrorDictionary("ERROR_DELETING");
      throw new Error(JSON.stringify(errorDict));
    }
  }
}

