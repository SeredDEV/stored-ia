import { SupabaseClient } from "@supabase/supabase-js";
import type { Producto } from "../productoModel";
import { productoGetDictionary } from "./productoGet.dictionary";

export interface IProductoGetService {
  execute(id: string): Promise<Producto>;
}

export class ProductoGetService implements IProductoGetService {
  constructor(private readonly supabaseClient: SupabaseClient) {}

  async execute(id: string): Promise<Producto> {
    const { data, error } = await this.supabaseClient
      .from("producto")
      .select(
        `
        *,
        tipo_producto:tipo_producto_id(id, valor),
        coleccion:coleccion_id(id, titulo),
        variantes:variante_producto(
          id,
          titulo,
          sku,
          gestionar_inventario,
          permitir_pedido_pendiente
        ),
        imagenes:imagen_producto(
          id,
          url,
          rango
        ),
        categorias:categoria_producto_producto(
          categoria:categoria_producto_id(
            id,
            nombre,
            slug,
            descripcion,
            activa
          )
        ),
        etiquetas:producto_etiquetas(
          etiqueta:etiqueta_producto_id(
            id,
            valor
          )
        )
      `
      )
      .eq("id", id)
      .is("fecha_eliminacion", null)
      .single();

    if (error || !data) {
      throw new Error(productoGetDictionary.notFound.defaultMessage);
    }

    return data;
  }
}
