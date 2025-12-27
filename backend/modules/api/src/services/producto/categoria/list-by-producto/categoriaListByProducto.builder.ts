import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { ensureSupabaseConfig } from "../../../../config/env";
import {
  CategoriaListByProductoService,
  type ICategoriaListByProductoService,
} from "./categoriaListByProducto.service";

export class CategoriaListByProductoServiceBuilder {
  private supabaseClient?: SupabaseClient;

  public setSupabaseClient(client: SupabaseClient): this {
    this.supabaseClient = client;
    return this;
  }

  public build(): ICategoriaListByProductoService {
    if (!this.supabaseClient) {
      const { url, serviceRoleKey } = ensureSupabaseConfig();
      this.supabaseClient = createClient(url, serviceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });
    }

    return new CategoriaListByProductoService(this.supabaseClient);
  }
}
