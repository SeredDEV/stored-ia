import { SupabaseClient } from "@supabase/supabase-js";
import type { CreateVarianteInput, Variante } from "../productoVariante.model";
import { generateErrorDictionary } from "./varianteUpdate.dictionary";

export interface IVarianteUpdateService {
  execute(id: string, input: Partial<CreateVarianteInput>): Promise<Variante>;
}

export class VarianteUpdateService implements IVarianteUpdateService {
  constructor(private readonly supabaseClient: SupabaseClient) {}

  async execute(id: string, input: Partial<CreateVarianteInput>): Promise<Variante> {
    // Verificar que existe
    const { data: existing } = await this.supabaseClient
      .from("variante_producto")
      .select("*")
      .eq("id", id)
      .is("fecha_eliminacion", null)
      .single();

    if (!existing) {
      const error = generateErrorDictionary("NOT_FOUND");
      throw new Error(JSON.stringify(error));
    }

    // Verificar SKU duplicado si se está actualizando
    if (input.sku) {
      const { data: duplicate } = await this.supabaseClient
        .from("variante_producto")
        .select("id")
        .eq("sku", input.sku)
        .neq("id", id)
        .is("fecha_eliminacion", null)
        .single();

      if (duplicate) {
        const error = generateErrorDictionary("DUPLICATE_SKU");
        throw new Error(JSON.stringify(error));
      }
    }

    const { opciones, ...updateData } = input;

    const { data, error } = await this.supabaseClient
      .from("variante_producto")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error || !data) {
      const errorDict = generateErrorDictionary("ERROR_UPDATING");
      throw new Error(JSON.stringify(errorDict));
    }

    // Actualizar opciones si se proporcionan
    if (opciones) {
      // Eliminar relaciones existentes
      await this.supabaseClient
        .from("variante_opcion_producto")
        .delete()
        .eq("variante_id", id);

      // Crear nuevas relaciones
      if (opciones.length > 0) {
        const relaciones = opciones.map((opcion_valor_id) => ({
          variante_id: id,
          opcion_valor_id,
        }));

        await this.supabaseClient
          .from("variante_opcion_producto")
          .insert(relaciones);
      }
    }

    return data as Variante;
  }
}

