import { SupabaseClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";
import type { CreateEtiquetaInput, Etiqueta } from "../productoEtiqueta.model";
import { generateErrorDictionary } from "./etiquetaCreate.dictionary";

export interface IEtiquetaCreateService {
  execute(input: CreateEtiquetaInput): Promise<Etiqueta>;
}

/**
 * Servicio para crear etiquetas
 */
export class EtiquetaCreateService implements IEtiquetaCreateService {
  constructor(private readonly supabaseClient: SupabaseClient) {}

  /**
   * Crea una nueva etiqueta
   */
  async execute(input: CreateEtiquetaInput): Promise<Etiqueta> {
    const { valor, metadatos } = input;

    // Normalizar el valor
    const valorNormalizado = this.normalizeValor(valor);

    // Verificar si ya existe una etiqueta con este valor
    const { data: existing } = await this.supabaseClient
      .from("etiqueta_producto")
      .select("*")
      .eq("valor", valorNormalizado)
      .is("fecha_eliminacion", null)
      .single();

    if (existing) {
      const error = generateErrorDictionary("DUPLICATE_VALUE");
      throw new Error(JSON.stringify(error));
    }

    const { data, error } = await this.supabaseClient
      .from("etiqueta_producto")
      .insert({
        id: randomUUID(),
        valor: valorNormalizado,
        metadatos: metadatos || {},
      })
      .select()
      .single();

    if (error || !data) {
      console.error("Error de Supabase al crear etiqueta:", error);
      const errorDict = generateErrorDictionary("ERROR_CREATING");
      throw new Error(JSON.stringify(errorDict));
    }

    return data as Etiqueta;
  }

  /**
   * Normaliza un valor de etiqueta (minúsculas, trim)
   */
  private normalizeValor(valor: string): string {
    return valor.toLowerCase().trim();
  }
}
