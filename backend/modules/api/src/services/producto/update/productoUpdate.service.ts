import { SupabaseClient } from "@supabase/supabase-js";
import type { Producto } from "../productoModel";
import { productoUpdateDictionary } from "./productoUpdate.dictionary";

export interface UpdateProductoInput {
  titulo?: string;
  subtitulo?: string;
  descripcion?: string;
  slug?: string;
  activo?: boolean;
  tiene_descuento?: boolean;
  tipo_producto_id?: string;
  coleccion_id?: string;
}

export interface IProductoUpdateService {
  execute(id: string, input: UpdateProductoInput): Promise<Producto>;
}

export class ProductoUpdateService implements IProductoUpdateService {
  constructor(private readonly supabaseClient: SupabaseClient) {}

  async execute(id: string, input: UpdateProductoInput): Promise<Producto> {
    // Verificar que el producto existe
    const { data: existing, error: existingError } = await this.supabaseClient
      .from("producto")
      .select("id")
      .eq("id", id)
      .is("fecha_eliminacion", null)
      .single();

    if (existingError || !existing) {
      throw new Error(productoUpdateDictionary.notFound.defaultMessage);
    }

    // Si se está actualizando el slug, verificar que no exista
    if (input.slug) {
      const { data: slugExists } = await this.supabaseClient
        .from("producto")
        .select("id")
        .eq("slug", input.slug)
        .neq("id", id)
        .is("fecha_eliminacion", null)
        .single();

      if (slugExists) {
        throw new Error(productoUpdateDictionary.slugAlreadyExists.defaultMessage);
      }
    }

    // Actualizar
    const { data, error } = await this.supabaseClient
      .from("producto")
      .update({
        ...input,
        fecha_actualizacion: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(productoUpdateDictionary.errorUpdating.defaultMessage);
    }

    return data;
  }
}

