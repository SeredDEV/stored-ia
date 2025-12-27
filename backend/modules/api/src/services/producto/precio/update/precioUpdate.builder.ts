import { createClient } from "@supabase/supabase-js";
import { ensureSupabaseConfig } from "../../../../config/env";
import {
  PrecioUpdateService,
  type IPrecioUpdateService,
} from "./precioUpdate.service";

export const buildPrecioUpdateService = (): IPrecioUpdateService => {
  const { url, serviceRoleKey } = ensureSupabaseConfig();

  const supabaseClient = createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return new PrecioUpdateService(supabaseClient);
};
