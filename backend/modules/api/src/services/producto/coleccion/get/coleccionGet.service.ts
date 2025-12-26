import { SupabaseClient } from "@supabase/supabase-js";
import type { Coleccion } from "../productoColeccion.model";
import {
  coleccionGetDictionary,
  type ErrorDictionaryGenerator,
  type RValidationsNamesColeccionGet,
} from "./coleccionGet.dictionary";

export interface IColeccionGetService {
  execute(id: string): Promise<Coleccion>;
  getBySlug(slug: string): Promise<Coleccion | null>;
}

export class ColeccionGetService implements IColeccionGetService {
  constructor(
    private readonly supabaseClient: SupabaseClient,
    private readonly errorDictionaryGenerator?: ErrorDictionaryGenerator<RValidationsNamesColeccionGet>
  ) {}

  async execute(id: string): Promise<Coleccion> {
    const { data, error } = await this.supabaseClient
      .from("coleccion_producto")
      .select("*")
      .eq("id", id)
      .is("fecha_eliminacion", null)
      .single();

    if (error || !data) {
      throw new Error(JSON.stringify(coleccionGetDictionary.notFound));
    }

    return data;
  }

  async getBySlug(slug: string): Promise<Coleccion | null> {
    const { data, error } = await this.supabaseClient
      .from("coleccion_producto")
      .select("*")
      .eq("slug", slug)
      .is("fecha_eliminacion", null)
      .single();

    if (error) return null;
    return data;
  }
}
