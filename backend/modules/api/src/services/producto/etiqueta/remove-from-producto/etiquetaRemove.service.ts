import { SupabaseClient } from "@supabase/supabase-js";
import {
  etiquetaRemoveDictionary,
  type ErrorDictionaryGenerator,
  type RValidationsNamesEtiquetaRemove,
} from "./etiquetaRemove.dictionary";

export interface RemoveEtiquetaInput {
  producto_id: string;
  etiqueta_id: string;
}

export interface IEtiquetaRemoveService {
  execute(input: RemoveEtiquetaInput): Promise<void>;
}

export class EtiquetaRemoveService implements IEtiquetaRemoveService {
  constructor(
    private readonly supabaseClient: SupabaseClient,
    private readonly errorDictionaryGenerator?: ErrorDictionaryGenerator<RValidationsNamesEtiquetaRemove>
  ) {}

  async execute(input: RemoveEtiquetaInput): Promise<void> {
    const { producto_id, etiqueta_id } = input;

    // Verificar que el producto existe
    const { data: producto, error: productoError } = await this.supabaseClient
      .from("producto")
      .select("id")
      .eq("id", producto_id)
      .single();

    if (productoError || !producto) {
      throw new Error(etiquetaRemoveDictionary.productoNotFound.defaultMessage);
    }

    // Verificar que la relación existe
    const { data: relacion, error: relacionError } = await this.supabaseClient
      .from("producto_etiquetas")
      .select("*")
      .eq("producto_id", producto_id)
      .eq("etiqueta_producto_id", etiqueta_id)
      .single();

    if (relacionError || !relacion) {
      throw new Error(etiquetaRemoveDictionary.etiquetaNotFound.defaultMessage);
    }

    // Eliminar la relación
    const { error: deleteError } = await this.supabaseClient
      .from("producto_etiquetas")
      .delete()
      .eq("producto_id", producto_id)
      .eq("etiqueta_producto_id", etiqueta_id);

    if (deleteError) {
      throw new Error(etiquetaRemoveDictionary.errorRemoving.defaultMessage);
    }
  }
}
