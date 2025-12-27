import { SupabaseClient } from "@supabase/supabase-js";
import type { Precio } from "../productoPrecio.model";

export interface UpdatePrecioInput {
  monto?: number;
  codigo_moneda?: string;
  cantidad_minima?: number;
  cantidad_maxima?: number | null;
}

export interface IPrecioUpdateService {
  execute(precio_id: string, data: UpdatePrecioInput): Promise<Precio>;
}

export class PrecioUpdateService implements IPrecioUpdateService {
  constructor(private supabaseClient: SupabaseClient) {}

  async execute(precio_id: string, data: UpdatePrecioInput): Promise<Precio> {
    // 1. Verificar que el precio existe
    const { data: precioExistente, error: precioError } =
      await this.supabaseClient
        .from("precio")
        .select("id")
        .eq("id", precio_id)
        .single();

    if (precioError || !precioExistente) {
      throw new Error(
        JSON.stringify({
          statusCode: 404,
          message: "Precio no encontrado",
        })
      );
    }

    // 2. Actualizar el precio
    const updateData: any = {};
    if (data.monto !== undefined) updateData.monto = data.monto;
    if (data.codigo_moneda !== undefined)
      updateData.codigo_moneda = data.codigo_moneda;
    if (data.cantidad_minima !== undefined)
      updateData.cantidad_minima = data.cantidad_minima;
    if (data.cantidad_maxima !== undefined)
      updateData.cantidad_maxima = data.cantidad_maxima;

    const { data: precioActualizado, error: updateError } =
      await this.supabaseClient
        .from("precio")
        .update(updateData)
        .eq("id", precio_id)
        .select()
        .single();

    if (updateError || !precioActualizado) {
      throw new Error(
        JSON.stringify({
          statusCode: 500,
          message: "Error al actualizar el precio",
        })
      );
    }

    return precioActualizado as Precio;
  }
}
