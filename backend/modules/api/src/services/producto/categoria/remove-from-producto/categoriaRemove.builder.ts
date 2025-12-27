import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { ensureSupabaseConfig } from "../../../../config/env";
import {
  CategoriaRemoveService,
  type ICategoriaRemoveService,
} from "./categoriaRemove.service";

export class CategoriaRemoveServiceBuilder {
  private supabaseClient?: SupabaseClient;

  public setSupabaseClient(client: SupabaseClient): this {
    this.supabaseClient = client;
    return this;
  }

  public build(): ICategoriaRemoveService {
    if (!this.supabaseClient) {
      const { url, serviceRoleKey } = ensureSupabaseConfig();
      this.supabaseClient = createClient(url, serviceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });
    }

    return new CategoriaRemoveService(this.supabaseClient);
  }
}
