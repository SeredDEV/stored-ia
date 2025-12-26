import { SupabaseClient } from "@supabase/supabase-js";
import type { CreateEtiquetaInput, Etiqueta } from "../productoEtiqueta.model";
import { generateErrorDictionary } from "./etiquetaUpdate.dictionary";

export interface IEtiquetaUpdateService {
  execute(id: string, input: Partial<CreateEtiquetaInput>): Promise<Etiqueta>;
}

/**
 * Servicio para actualizar etiquetas
 */
export class EtiquetaUpdateService implements IEtiquetaUpdateService {
  constructor(private readonly supabaseClient: SupabaseClient) {}

  /**
   * Actualiza una etiqueta existente
   */
  async execute(
    id: string,
    input: Partial<CreateEtiquetaInput>
  ): Promise<Etiqueta> {
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

    const updateData: any = {};

    if (input.valor !== undefined) {
      const valorNormalizado = input.valor.toLowerCase().trim();

      // Verificar si ya existe otra etiqueta con este valor
      const { data: duplicate } = await this.supabaseClient
        .from("etiqueta_producto")
        .select("*")
        .eq("valor", valorNormalizado)
        .neq("id", id)
        .is("fecha_eliminacion", null)
        .single();

      if (duplicate) {
        const error = generateErrorDictionary("DUPLICATE_VALUE");
        throw new Error(JSON.stringify(error));
      }

      updateData.valor = valorNormalizado;
    }

    if (input.metadatos !== undefined) {
      updateData.metadatos = input.metadatos;
    }

    const { data, error } = await this.supabaseClient
      .from("etiqueta_producto")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error || !data) {
      const errorDict = generateErrorDictionary("ERROR_UPDATING");
      throw new Error(JSON.stringify(errorDict));
    }

    return data as Etiqueta;
  }
}

