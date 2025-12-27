import { SupabaseClient } from "@supabase/supabase-js";
import type { Precio } from "../../../precio/productoPrecio.model";

export interface IPrecioListService {
  execute(variante_id: string): Promise<Precio[]>;
}

export class PrecioListService implements IPrecioListService {
  constructor(private supabaseClient: SupabaseClient) {}

  async execute(variante_id: string): Promise<Precio[]> {
    // 1. Verificar que la variante existe
    const { data: variante, error: varianteError } = await this.supabaseClient
      .from("variante_producto")
      .select("id")
      .eq("id", variante_id)
      .single();

    if (varianteError || !variante) {
      throw new Error(
        JSON.stringify({
          statusCode: 404,
          message: "Variante no encontrada",
        })
      );
    }

    // 2. Obtener el conjunto de precios asociado a la variante
    const { data: conjuntoRelacion } = await this.supabaseClient
      .from("variante_producto_conjunto_precios")
      .select("conjunto_precios_id")
      .eq("variante_id", variante_id)
      .single();

    if (!conjuntoRelacion) {
      return [];
    }

    // 3. Obtener todos los precios del conjunto
    const { data: precios, error: preciosError } = await this.supabaseClient
      .from("precio")
      .select("*")
      .eq("conjunto_precios_id", conjuntoRelacion.conjunto_precios_id)
      .order("codigo_moneda", { ascending: true });

    if (preciosError) {
      throw new Error(
        JSON.stringify({
          statusCode: 500,
          message: "Error al obtener los precios",
        })
      );
    }

    return (precios || []) as Precio[];
  }
}
