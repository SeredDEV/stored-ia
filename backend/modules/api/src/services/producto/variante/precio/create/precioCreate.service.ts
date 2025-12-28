import { SupabaseClient } from "@supabase/supabase-js";
import type {
  CreatePrecioInput,
  Precio,
} from "../../../precio/productoPrecio.model";
import { generateErrorDictionary } from "./precioCreate.dictionary";

export interface IPrecioCreateService {
  execute(input: CreatePrecioInput): Promise<Precio>;
}

export class PrecioCreateService implements IPrecioCreateService {
  constructor(private readonly supabaseClient: SupabaseClient) {}

  async execute(input: CreatePrecioInput): Promise<Precio> {
    const {
      variante_id,
      monto,
      codigo_moneda,
      cantidad_minima,
      cantidad_maxima,
    } = input;

    // Si el monto viene en pesos (no centavos) detectarlo y normalizar a centavos
    // Regla simple: si es >= 1_000_000 asumimos que ya está en centavos; si es menor, lo multiplicamos por 100.
    const normalizedMonto =
      monto >= 1_000_000 ? monto : Math.round(monto * 100);

    // 1. Verificar si la variante existe
    const { data: variante, error: varianteError } = await this.supabaseClient
      .from("variante_producto")
      .select("id")
      .eq("id", variante_id)
      .is("fecha_eliminacion", null)
      .single();

    if (varianteError || !variante) {
      const error = generateErrorDictionary("VARIANTE_NOT_FOUND");
      throw new Error(JSON.stringify(error));
    }

    // 2. Verificar si la variante ya tiene un conjunto de precios
    const { data: conjuntoRelacion } = await this.supabaseClient
      .from("variante_producto_conjunto_precios")
      .select("conjunto_precios_id")
      .eq("variante_id", variante_id)
      .single();

    let conjunto_precios_id: string;

    if (!conjuntoRelacion) {
      // 3. Crear conjunto de precios si no existe
      const { data: nuevoConjunto, error: conjuntoError } =
        await this.supabaseClient
          .from("conjunto_precios")
          .insert({
            id: crypto.randomUUID(),
          })
          .select()
          .single();

      if (conjuntoError || !nuevoConjunto) {
        const error = generateErrorDictionary("ERROR_CREATING_CONJUNTO");
        throw new Error(JSON.stringify(error));
      }

      conjunto_precios_id = nuevoConjunto.id;

      // 4. Relacionar variante con conjunto de precios
      const { error: relacionError } = await this.supabaseClient
        .from("variante_producto_conjunto_precios")
        .insert({
          variante_id,
          conjunto_precios_id,
        });

      if (relacionError) {
        const error = generateErrorDictionary("ERROR_CREATING_RELACION");
        throw new Error(JSON.stringify(error));
      }
    } else {
      conjunto_precios_id = conjuntoRelacion.conjunto_precios_id;
    }

    // 5. Crear el precio
    const { data: precio, error: precioError } = await this.supabaseClient
      .from("precio")
      .insert({
        id: crypto.randomUUID(),
        conjunto_precios_id,
        monto: normalizedMonto,
        codigo_moneda,
        cantidad_minima: cantidad_minima ?? 1,
        cantidad_maxima: cantidad_maxima ?? null,
      })
      .select()
      .single();

    if (precioError || !precio) {
      const error = generateErrorDictionary("ERROR_CREATING_PRECIO");
      throw new Error(JSON.stringify(error));
    }

    return precio as Precio;
  }
}
