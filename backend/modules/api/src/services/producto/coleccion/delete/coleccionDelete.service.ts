import { SupabaseClient } from "@supabase/supabase-js";
import {
  coleccionDeleteDictionary,
  type ErrorDictionaryGenerator,
  type RValidationsNamesColeccionDelete,
} from "./coleccionDelete.dictionary";

export interface IColeccionDeleteService {
  delete(id: string): Promise<void>;
}

export class ColeccionDeleteService implements IColeccionDeleteService {
  constructor(
    private readonly supabaseClient: SupabaseClient,
    private readonly errorDictionaryGenerator?: ErrorDictionaryGenerator<RValidationsNamesColeccionDelete>
  ) {}

  async delete(id: string): Promise<void> {
    // Verificar si la colección existe
    const { data: coleccion } = await this.supabaseClient
      .from("coleccion_producto")
      .select("id")
      .eq("id", id)
      .is("fecha_eliminacion", null)
      .single();

    if (!coleccion) {
      throw new Error(coleccionDeleteDictionary.notFound.defaultMessage);
    }

    // Eliminar (soft delete)
    const { error } = await this.supabaseClient
      .from("coleccion_producto")
      .update({ fecha_eliminacion: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      throw new Error(coleccionDeleteDictionary.errorDeleting.defaultMessage);
    }
  }
}

