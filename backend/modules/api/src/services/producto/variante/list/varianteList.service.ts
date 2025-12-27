import { SupabaseClient } from "@supabase/supabase-js";
import type { Variante } from "../productoVariante.model";

export interface IVarianteListService {
  execute(producto_id: string): Promise<Variante[]>;
  executeWithProduct(
    producto_id: string
  ): Promise<{ producto: any; variantes: Variante[] }>;
}

export class VarianteListService implements IVarianteListService {
  constructor(private readonly supabaseClient: SupabaseClient) {}

  async execute(producto_id: string): Promise<Variante[]> {
    const { data, error } = await this.supabaseClient
      .from("variante_producto")
      .select("*")
      .eq("producto_id", producto_id)
      .is("fecha_eliminacion", null)
      .order("rango_variante", { ascending: true });

    if (error) {
      throw new Error(`Error al listar variantes: ${error.message}`);
    }

    return (data || []) as Variante[];
  }

  async executeWithProduct(
    producto_id: string
  ): Promise<{ producto: any; variantes: Variante[] }> {
    // Get producto con tipo y colección
    const { data: producto, error: productoError } = await this.supabaseClient
      .from("producto")
      .select(
        `
        *,
        tipo_producto:tipo_producto_id(*),
        coleccion:coleccion_id(*)
      `
      )
      .eq("id", producto_id)
      .is("fecha_eliminacion", null)
      .single();

    if (productoError) {
      throw new Error(`Error al obtener producto: ${productoError.message}`);
    }

    // Get variantes
    const { data: variantes, error: variantesError } = await this.supabaseClient
      .from("variante_producto")
      .select("*")
      .eq("producto_id", producto_id)
      .is("fecha_eliminacion", null)
      .order("rango_variante", { ascending: true });

    if (variantesError) {
      throw new Error(`Error al listar variantes: ${variantesError.message}`);
    }

    // Get precios para cada variante
    const variantesConPrecios = await Promise.all(
      (variantes || []).map(async (variante) => {
        // Get conjunto_precios_id de la variante
        const { data: conjuntoRelacion } = await this.supabaseClient
          .from("variante_producto_conjunto_precios")
          .select("conjunto_precios_id")
          .eq("variante_id", variante.id)
          .single();

        if (!conjuntoRelacion) {
          return { ...variante, precios: [] };
        }

        // Get precios del conjunto
        const { data: precios } = await this.supabaseClient
          .from("precio")
          .select("*")
          .eq("conjunto_precios_id", conjuntoRelacion.conjunto_precios_id)
          .is("fecha_eliminacion", null);

        return {
          ...variante,
          precios: precios || [],
        };
      })
    );

    return {
      producto,
      variantes: variantesConPrecios as any[],
    };
  }
}
