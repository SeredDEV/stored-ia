import { SupabaseClient } from "@supabase/supabase-js";
import type { CreateCategoriaInput, Categoria } from "../productoCategoria.model";
import {
  categoriaCreateDictionary,
  type ErrorDictionaryGenerator,
  type RValidationsNamesCategoriaCreate,
} from "./categoriaCreate.dictionary";

export interface ICategoriaCreateService {
  create(input: CreateCategoriaInput): Promise<Categoria>;
}

export class CategoriaCreateService implements ICategoriaCreateService {
  constructor(
    private readonly supabaseClient: SupabaseClient,
    private readonly errorDictionaryGenerator?: ErrorDictionaryGenerator<RValidationsNamesCategoriaCreate>
  ) {}

  async create(input: CreateCategoriaInput): Promise<Categoria> {
    const {
      nombre,
      descripcion,
      slug,
      categoria_padre_id,
      rango = 0,
      activa = true,
      interna = false,
      metadatos,
    } = input;

    // Verificar si la categoría padre existe
    if (categoria_padre_id) {
      const { data: padre } = await this.supabaseClient
        .from("categoria_producto")
        .select("id")
        .eq("id", categoria_padre_id)
        .single();

      if (!padre) {
        throw new Error(categoriaCreateDictionary.categoriaPadreNotFound.defaultMessage);
      }
    }

    // Crear la categoría
    const { data, error } = await this.supabaseClient
      .from("categoria_producto")
      .insert({
        id: crypto.randomUUID(),
        nombre,
        descripcion,
        slug: slug || this.generateSlug(nombre),
        categoria_padre_id,
        rango,
        activa,
        interna,
        metadatos,
        fecha_creacion: new Date().toISOString(),
        fecha_actualizacion: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw new Error(categoriaCreateDictionary.errorCreating.defaultMessage);
    }

    return data;
  }

  private generateSlug(nombre: string): string {
    return nombre
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }
}

