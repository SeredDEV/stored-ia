import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { ensureSupabaseConfig } from "../../../../config/env";
import {
  EtiquetaAssignService,
  type IEtiquetaAssignService,
} from "./etiquetaAssign.service";

export class EtiquetaAssignServiceBuilder {
  private supabaseClient?: SupabaseClient;

  public setSupabaseClient(client: SupabaseClient): this {
    this.supabaseClient = client;
    return this;
  }

  public build(): IEtiquetaAssignService {
    if (!this.supabaseClient) {
      const { url, serviceRoleKey } = ensureSupabaseConfig();
      this.supabaseClient = createClient(url, serviceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });
    }

    return new EtiquetaAssignService(this.supabaseClient);
  }
}
