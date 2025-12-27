import { ImagenesUploadController } from "./imagenesUpload.controller";
import { ImagenesUploadValidator } from "./imagenesUpload.validator";
import type { StorageUploadService } from "../../../../services/producto/storage/upload/storageUpload.service";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";
import { ensureSupabaseConfig } from "../../../../config/env";

export interface ImagenesUploadEndpointArgs {
  storageService: StorageUploadService;
  supabaseClient?: SupabaseClient;
}

export class ImagenesUploadEndpoint {
  public validator: ImagenesUploadValidator;
  public controller: ImagenesUploadController;

  constructor(args: ImagenesUploadEndpointArgs) {
    const supabaseConfig = ensureSupabaseConfig();
    const supabaseKey = supabaseConfig.serviceRoleKey || supabaseConfig.anonKey;

    // Usar el client inyectado si existe; si no, crear uno con las mismas credenciales de la API
    const supabaseClient =
      args.supabaseClient ||
      createClient(supabaseConfig.url, supabaseKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });

    if (!supabaseConfig.serviceRoleKey) {
      console.warn(
        "[ImagenesUploadEndpoint] SUPABASE_SERVICE_ROLE_KEY no está configurado; usando ANON_KEY para uploads"
      );
    }

    this.validator = new ImagenesUploadValidator();
    this.controller = new ImagenesUploadController(
      args.storageService,
      supabaseClient
    );
  }
}
