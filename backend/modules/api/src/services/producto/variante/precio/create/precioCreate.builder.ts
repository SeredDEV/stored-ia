import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { ensureSupabaseConfig } from "../../../../../config/env";
import { PrecioCreateService } from "./precioCreate.service";

export class PrecioCreateServiceBuilder {
  private supabaseClient?: SupabaseClient;

  setSupabaseClient(client: SupabaseClient): this {
    this.supabaseClient = client;
    return this;
  }

  build(): PrecioCreateService {
    if (!this.supabaseClient) {
      const { url, serviceRoleKey } = ensureSupabaseConfig();
      this.supabaseClient = createClient(url, serviceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });
    }
    return new PrecioCreateService(this.supabaseClient);
  }
}
