import { SupabaseClient } from "@supabase/supabase-js";
import type { CreateTipoProductoInput, TipoProducto } from "../productoTipo.model";
import { generateErrorDictionary } from "./tipoUpdate.dictionary";

export interface ITipoUpdateService {
  execute(id: string, input: Partial<CreateTipoProductoInput>): Promise<TipoProducto>;
}

export class TipoUpdateService implements ITipoUpdateService {
  constructor(private readonly supabaseClient: SupabaseClient) {}

  async execute(id: string, input: Partial<CreateTipoProductoInput>): Promise<TipoProducto> {
    // Verificar que existe
    const { data: existing } = await this.supabaseClient
      .from("tipo_producto")
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
      // Verificar duplicados
      const { data: duplicate } = await this.supabaseClient
        .from("tipo_producto")
        .select("*")
        .eq("valor", input.valor)
        .neq("id", id)
        .is("fecha_eliminacion", null)
        .single();

      if (duplicate) {
        const error = generateErrorDictionary("DUPLICATE_VALUE");
        throw new Error(JSON.stringify(error));
      }

      updateData.valor = input.valor;
    }

    if (input.metadatos !== undefined) {
      updateData.metadatos = input.metadatos;
    }

    const { data, error } = await this.supabaseClient
      .from("tipo_producto")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error || !data) {
      const errorDict = generateErrorDictionary("ERROR_UPDATING");
      throw new Error(JSON.stringify(errorDict));
    }

    return data as TipoProducto;
  }
}

