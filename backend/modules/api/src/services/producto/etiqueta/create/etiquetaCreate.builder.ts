import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { ensureSupabaseConfig } from "../../../../config/env";
import { EtiquetaCreateService } from "./etiquetaCreate.service";

export class EtiquetaCreateServiceBuilder {
  private supabaseClient?: SupabaseClient;

  setSupabaseClient(client: SupabaseClient): this {
    this.supabaseClient = client;
    return this;
  }

  build(): EtiquetaCreateService {
    if (!this.supabaseClient) {
      const { url, serviceRoleKey } = ensureSupabaseConfig();
      this.supabaseClient = createClient(url, serviceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });
    }

    return new EtiquetaCreateService(this.supabaseClient);
  }
}

