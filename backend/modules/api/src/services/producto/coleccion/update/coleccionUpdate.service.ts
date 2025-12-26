import { SupabaseClient } from "@supabase/supabase-js";
import type { CreateColeccionInput, Coleccion } from "../productoColeccion.model";
import {
  coleccionUpdateDictionary,
  type ErrorDictionaryGenerator,
  type RValidationsNamesColeccionUpdate,
} from "./coleccionUpdate.dictionary";

export interface IColeccionUpdateService {
  update(id: string, input: Partial<CreateColeccionInput>): Promise<Coleccion>;
}

export class ColeccionUpdateService implements IColeccionUpdateService {
  constructor(
    private readonly supabaseClient: SupabaseClient,
    private readonly errorDictionaryGenerator?: ErrorDictionaryGenerator<RValidationsNamesColeccionUpdate>
  ) {}

  async update(
    id: string,
    input: Partial<CreateColeccionInput>
  ): Promise<Coleccion> {
    // Verificar si la colección existe
    const { data: exists } = await this.supabaseClient
      .from("coleccion_producto")
      .select("id")
      .eq("id", id)
      .is("fecha_eliminacion", null)
      .single();

    if (!exists) {
      throw new Error(coleccionUpdateDictionary.notFound.defaultMessage);
    }

    // Actualizar
    const { data, error } = await this.supabaseClient
      .from("coleccion_producto")
      .update({
        ...input,
        fecha_actualizacion: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(coleccionUpdateDictionary.errorUpdating.defaultMessage);
    }

    return data;
  }
}

