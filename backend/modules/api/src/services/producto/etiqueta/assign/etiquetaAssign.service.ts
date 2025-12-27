import { SupabaseClient } from "@supabase/supabase-js";
import {
  etiquetaAssignDictionary,
  type ErrorDictionaryGenerator,
  type RValidationsNamesEtiquetaAssign,
} from "./etiquetaAssign.dictionary";

export interface AssignEtiquetasInput {
  producto_id: string;
  etiqueta_ids: string[];
}

export interface IEtiquetaAssignService {
  execute(input: AssignEtiquetasInput): Promise<void>;
}

export class EtiquetaAssignService implements IEtiquetaAssignService {
  constructor(
    private readonly supabaseClient: SupabaseClient,
    private readonly errorDictionaryGenerator?: ErrorDictionaryGenerator<RValidationsNamesEtiquetaAssign>
  ) {}

  async execute(input: AssignEtiquetasInput): Promise<void> {
    const { producto_id, etiqueta_ids } = input;

    // 1. Verificar que el producto existe
    const { data: producto, error: productoError } = await this.supabaseClient
      .from("producto")
      .select("id")
      .eq("id", producto_id)
      .single();

    if (productoError || !producto) {
      throw new Error(etiquetaAssignDictionary.productoNotFound.defaultMessage);
    }

    // 2. Eliminar las etiquetas actuales del producto
    const { error: deleteError } = await this.supabaseClient
      .from("producto_etiquetas")
      .delete()
      .eq("producto_id", producto_id);

    if (deleteError) {
      throw new Error(etiquetaAssignDictionary.errorDeleting.defaultMessage);
    }

    // 3. Si hay nuevas etiquetas, insertarlas
    if (etiqueta_ids.length > 0) {
      const records = etiqueta_ids.map((etiqueta_id) => ({
        producto_id,
        etiqueta_producto_id: etiqueta_id,
      }));

      const { error: insertError } = await this.supabaseClient
        .from("producto_etiquetas")
        .insert(records);

      if (insertError) {
        throw new Error(etiquetaAssignDictionary.errorAssigning.defaultMessage);
      }
    }
  }
}
