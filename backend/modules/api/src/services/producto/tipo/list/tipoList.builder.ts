import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { ensureSupabaseConfig } from "../../../../config/env";
import { TipoListService } from "./tipoList.service";

export class TipoListServiceBuilder {
  private supabaseClient?: SupabaseClient;

  setSupabaseClient(client: SupabaseClient): this {
    this.supabaseClient = client;
    return this;
  }

  build(): TipoListService {
    if (!this.supabaseClient) {
      const { url, serviceRoleKey } = ensureSupabaseConfig();
      this.supabaseClient = createClient(url, serviceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });
    }
    return new TipoListService(this.supabaseClient);
  }
}

