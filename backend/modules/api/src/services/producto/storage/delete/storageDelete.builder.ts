import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { ensureSupabaseConfig } from "../../../../config/env";
import { StorageDeleteService } from "./storageDelete.service";

export class StorageDeleteServiceBuilder {
  private supabaseClient?: SupabaseClient;

  setSupabaseClient(client: SupabaseClient): this {
    this.supabaseClient = client;
    return this;
  }

  build(): StorageDeleteService {
    if (!this.supabaseClient) {
      const { url, serviceRoleKey } = ensureSupabaseConfig();
      this.supabaseClient = createClient(url, serviceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });
    }
    return new StorageDeleteService(this.supabaseClient);
  }
}

