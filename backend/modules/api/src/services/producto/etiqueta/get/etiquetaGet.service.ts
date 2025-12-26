import { SupabaseClient } from "@supabase/supabase-js";
import type { Etiqueta } from "../productoEtiqueta.model";
import { generateErrorDictionary } from "./etiquetaGet.dictionary";

export interface IEtiquetaGetService {
  execute(id: string): Promise<Etiqueta>;
  getByValor(valor: string): Promise<Etiqueta | null>;
}

/**
 * Servicio para obtener etiquetas
 */
export class EtiquetaGetService implements IEtiquetaGetService {
  constructor(private readonly supabaseClient: SupabaseClient) {}

  /**
   * Obtiene una etiqueta por ID
   */
  async execute(id: string): Promise<Etiqueta> {
    const { data, error } = await this.supabaseClient
      .from("etiqueta_producto")
      .select("*")
      .eq("id", id)
      .is("fecha_eliminacion", null)
      .single();

    if (error || !data) {
      const errorDict = generateErrorDictionary("NOT_FOUND");
      throw new Error(JSON.stringify(errorDict));
    }

    return data as Etiqueta;
  }

  /**
   * Obtiene una etiqueta por valor
   */
  async getByValor(valor: string): Promise<Etiqueta | null> {
    const valorNormalizado = valor.toLowerCase().trim();

    const { data } = await this.supabaseClient
      .from("etiqueta_producto")
      .select("*")
      .eq("valor", valorNormalizado)
      .is("fecha_eliminacion", null)
      .single();

    return data ? (data as Etiqueta) : null;
  }
}
