import { ImagenesUploadController } from "./imagenesUpload.controller";
import { ImagenesUploadValidator } from "./imagenesUpload.validator";
import type { StorageUploadService } from "../../../../services/producto/storage/upload/storageUpload.service";
import type { SupabaseClient } from "@supabase/supabase-js";

export interface ImagenesUploadEndpointArgs {
  storageService: StorageUploadService;
  supabaseClient: SupabaseClient;
}

export class ImagenesUploadEndpoint {
  public validator: ImagenesUploadValidator;
  public controller: ImagenesUploadController;

  constructor(args: ImagenesUploadEndpointArgs) {
    this.validator = new ImagenesUploadValidator();
    this.controller = new ImagenesUploadController(
      args.storageService,
      args.supabaseClient
    );
  }
}
