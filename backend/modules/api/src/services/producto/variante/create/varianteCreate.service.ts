import { SupabaseClient } from "@supabase/supabase-js";
import type { CreateVarianteInput, Variante } from "../productoVariante.model";
import { generateErrorDictionary } from "./varianteCreate.dictionary";

export interface IVarianteCreateService {
  execute(input: CreateVarianteInput): Promise<Variante>;
}

export class VarianteCreateService implements IVarianteCreateService {
  constructor(private readonly supabaseClient: SupabaseClient) {}

  async execute(input: CreateVarianteInput): Promise<Variante> {
    const { producto_id, sku, opciones, ...varianteData } = input;

    // Verificar que el producto existe
    const { data: producto } = await this.supabaseClient
      .from("producto")
      .select("id")
      .eq("id", producto_id)
      .is("fecha_eliminacion", null)
      .single();

    if (!producto) {
      const error = generateErrorDictionary("PRODUCT_NOT_FOUND");
      throw new Error(JSON.stringify(error));
    }

    // Verificar SKU duplicado si se proporciona
    if (sku) {
      const { data: existing } = await this.supabaseClient
        .from("variante_producto")
        .select("id")
        .eq("sku", sku)
        .is("fecha_eliminacion", null)
        .single();

      if (existing) {
        const error = generateErrorDictionary("DUPLICATE_SKU");
        throw new Error(JSON.stringify(error));
      }
    }

    // Crear la variante
    const { data, error } = await this.supabaseClient
      .from("variante_producto")
      .insert({
        id: crypto.randomUUID(),
        producto_id,
        sku,
        ...varianteData,
        permitir_pedido_pendiente:
          varianteData.permitir_pedido_pendiente ?? false,
        gestionar_inventario: varianteData.gestionar_inventario ?? true,
      })
      .select()
      .single();

    if (error || !data) {
      const errorDict = generateErrorDictionary("ERROR_CREATING");
      throw new Error(JSON.stringify(errorDict));
    }

    // Si hay opciones, crear las relaciones
    if (opciones && opciones.length > 0) {
      const relaciones = opciones.map((opcion_valor_id) => ({
        variante_id: data.id,
        opcion_valor_id,
      }));

      await this.supabaseClient
        .from("variante_opcion_producto")
        .insert(relaciones);
    }

    return data as Variante;
  }
}
