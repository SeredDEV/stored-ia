import { SupabaseClient } from "@supabase/supabase-js";
import type { CreateTipoProductoInput, TipoProducto } from "../productoTipo.model";
import { generateErrorDictionary } from "./tipoCreate.dictionary";

export interface ITipoCreateService {
  execute(input: CreateTipoProductoInput): Promise<TipoProducto>;
}

export class TipoCreateService implements ITipoCreateService {
  constructor(private readonly supabaseClient: SupabaseClient) { }

  async execute(input: CreateTipoProductoInput): Promise<TipoProducto> {
    const { valor, metadatos } = input;

    // Verificar si ya existe
    const { data: existing } = await this.supabaseClient
      .from("tipo_producto")
      .select("*")
      .eq("valor", valor)
      .is("fecha_eliminacion", null)
      .single();

    if (existing) {
      const error = generateErrorDictionary("DUPLICATE_VALUE");
      throw new Error(JSON.stringify(error));
    }

    const { data, error } = await this.supabaseClient
      .from("tipo_producto")
      .insert({
        id: crypto.randomUUID(),
        valor,
        metadatos: metadatos || {}
      })
      .select()
      .single();

    if (error || !data) {
      const errorDict = generateErrorDictionary("ERROR_CREATING");
      throw new Error(JSON.stringify(errorDict));
    }

    return data as TipoProducto;
  }
}

