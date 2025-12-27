import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { ensureSupabaseConfig } from "../../../../config/env";
import {
  EtiquetaListByProductoService,
  type IEtiquetaListByProductoService,
} from "./etiquetaListByProducto.service";

export class EtiquetaListByProductoServiceBuilder {
  private supabaseClient?: SupabaseClient;

  public setSupabaseClient(client: SupabaseClient): this {
    this.supabaseClient = client;
    return this;
  }

  public build(): IEtiquetaListByProductoService {
    if (!this.supabaseClient) {
      const { url, serviceRoleKey } = ensureSupabaseConfig();
      this.supabaseClient = createClient(url, serviceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });
    }

    return new EtiquetaListByProductoService(this.supabaseClient);
  }
}
