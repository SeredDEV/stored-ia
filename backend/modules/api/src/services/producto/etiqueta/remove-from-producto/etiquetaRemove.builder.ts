import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { ensureSupabaseConfig } from "../../../../config/env";
import {
  EtiquetaRemoveService,
  type IEtiquetaRemoveService,
} from "./etiquetaRemove.service";

export class EtiquetaRemoveServiceBuilder {
  private supabaseClient?: SupabaseClient;

  public setSupabaseClient(client: SupabaseClient): this {
    this.supabaseClient = client;
    return this;
  }

  public build(): IEtiquetaRemoveService {
    if (!this.supabaseClient) {
      const { url, serviceRoleKey } = ensureSupabaseConfig();
      this.supabaseClient = createClient(url, serviceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });
    }

    return new EtiquetaRemoveService(this.supabaseClient);
  }
}
