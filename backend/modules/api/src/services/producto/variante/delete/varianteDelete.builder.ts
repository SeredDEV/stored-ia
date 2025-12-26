import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { ensureSupabaseConfig } from "../../../../config/env";
import { VarianteDeleteService } from "./varianteDelete.service";

export class VarianteDeleteServiceBuilder {
  private supabaseClient?: SupabaseClient;

  setSupabaseClient(client: SupabaseClient): this {
    this.supabaseClient = client;
    return this;
  }

  build(): VarianteDeleteService {
    if (!this.supabaseClient) {
      const { url, serviceRoleKey } = ensureSupabaseConfig();
      this.supabaseClient = createClient(url, serviceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });
    }
    return new VarianteDeleteService(this.supabaseClient);
  }
}

