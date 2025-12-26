import { SupabaseClient } from "@supabase/supabase-js";
import type { Etiqueta } from "../productoEtiqueta.model";

export interface IEtiquetaListService {
  execute(): Promise<Etiqueta[]>;
}

/**
 * Servicio para listar etiquetas
 */
export class EtiquetaListService implements IEtiquetaListService {
  constructor(private readonly supabaseClient: SupabaseClient) {}

  /**
   * Lista todas las etiquetas activas
   */
  async execute(): Promise<Etiqueta[]> {
    const { data, error } = await this.supabaseClient
      .from("etiqueta_producto")
      .select("*")
      .is("fecha_eliminacion", null)
      .order("valor", { ascending: true });

    if (error) {
      throw new Error(`Error al listar etiquetas: ${error.message}`);
    }

    return (data || []) as Etiqueta[];
  }
}
