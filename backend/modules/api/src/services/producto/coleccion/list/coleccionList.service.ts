import { SupabaseClient } from "@supabase/supabase-js";
import type { Coleccion } from "../productoColeccion.model";

export interface IColeccionListService {
  list(): Promise<Coleccion[]>;
}

export class ColeccionListService implements IColeccionListService {
  constructor(private readonly supabaseClient: SupabaseClient) {}

  async list(): Promise<Coleccion[]> {
    const { data, error } = await this.supabaseClient
      .from("coleccion_producto")
      .select("*")
      .is("fecha_eliminacion", null)
      .order("fecha_creacion", { ascending: false });

    if (error) {
      throw new Error(`Error al listar colecciones: ${error.message}`);
    }

    return data || [];
  }
}

