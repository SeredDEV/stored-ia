import { createClient } from "@supabase/supabase-js";
import { ensureSupabaseConfig } from "../../../../../config/env";
import {
  PrecioListService,
  type IPrecioListService,
} from "./precioList.service";

export const buildPrecioListService = (): IPrecioListService => {
  const { url, anonKey } = ensureSupabaseConfig();

  const supabaseClient = createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return new PrecioListService(supabaseClient);
};
