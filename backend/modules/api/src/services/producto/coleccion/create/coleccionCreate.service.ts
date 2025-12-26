import { SupabaseClient } from "@supabase/supabase-js";
import type { CreateColeccionInput, Coleccion } from "../productoColeccion.model";
import {
  coleccionCreateDictionary,
  type ErrorDictionaryGenerator,
  type RValidationsNamesColeccionCreate,
} from "./coleccionCreate.dictionary";

export interface IColeccionCreateService {
  create(input: CreateColeccionInput): Promise<Coleccion>;
}

export class ColeccionCreateService implements IColeccionCreateService {
  constructor(
    private readonly supabaseClient: SupabaseClient,
    private readonly errorDictionaryGenerator?: ErrorDictionaryGenerator<RValidationsNamesColeccionCreate>
  ) {}

  async create(input: CreateColeccionInput): Promise<Coleccion> {
    const { titulo, slug, metadatos } = input;

    // Generar slug automáticamente si no se proporciona
    const finalSlug = slug || this.generateSlug(titulo);

    // Crear la colección
    const { data, error } = await this.supabaseClient
      .from("coleccion_producto")
      .insert({
        id: crypto.randomUUID(),
        titulo,
        slug: finalSlug,
        metadatos,
        fecha_creacion: new Date().toISOString(),
        fecha_actualizacion: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        throw new Error(coleccionCreateDictionary.slugDuplicated.defaultMessage);
      }
      throw new Error(coleccionCreateDictionary.errorCreating.defaultMessage);
    }

    return data;
  }

  private generateSlug(titulo: string): string {
    return titulo
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
}

