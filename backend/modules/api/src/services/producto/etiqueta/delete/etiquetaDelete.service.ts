import { SupabaseClient } from "@supabase/supabase-js";
import { generateErrorDictionary } from "./etiquetaDelete.dictionary";

export interface IEtiquetaDeleteService {
  execute(id: string): Promise<void>;
}

/**
 * Servicio para eliminar etiquetas (soft delete)
 */
export class EtiquetaDeleteService implements IEtiquetaDeleteService {
  constructor(private readonly supabaseClient: SupabaseClient) {}

  /**
   * Elimina una etiqueta (soft delete)
   */
  async execute(id: string): Promise<void> {
    // Verificar que la etiqueta existe
    const { data: existing } = await this.supabaseClient
      .from("etiqueta_producto")
      .select("*")
      .eq("id", id)
      .is("fecha_eliminacion", null)
      .single();

    if (!existing) {
      const error = generateErrorDictionary("NOT_FOUND");
      throw new Error(JSON.stringify(error));
    }

    const { error } = await this.supabaseClient
      .from("etiqueta_producto")
      .update({ fecha_eliminacion: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      const errorDict = generateErrorDictionary("ERROR_DELETING");
      throw new Error(JSON.stringify(errorDict));
    }
  }
}

