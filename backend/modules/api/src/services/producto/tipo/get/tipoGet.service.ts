import { SupabaseClient } from "@supabase/supabase-js";
import type { TipoProducto } from "../productoTipo.model";
import { generateErrorDictionary } from "./tipoGet.dictionary";

export interface ITipoGetService {
  execute(id: string): Promise<TipoProducto>;
  getByValor(valor: string): Promise<TipoProducto | null>;
}

export class TipoGetService implements ITipoGetService {
  constructor(private readonly supabaseClient: SupabaseClient) {}

  async execute(id: string): Promise<TipoProducto> {
    const { data, error } = await this.supabaseClient
      .from("tipo_producto")
      .select("*")
      .eq("id", id)
      .is("fecha_eliminacion", null)
      .single();

    if (error || !data) {
      const errorDict = generateErrorDictionary("NOT_FOUND");
      throw new Error(JSON.stringify(errorDict));
    }

    return data as TipoProducto;
  }

  async getByValor(valor: string): Promise<TipoProducto | null> {
    const { data } = await this.supabaseClient
      .from("tipo_producto")
      .select("*")
      .eq("valor", valor)
      .is("fecha_eliminacion", null)
      .single();

    return data ? (data as TipoProducto) : null;
  }
}

