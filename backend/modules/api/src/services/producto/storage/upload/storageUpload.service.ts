import { SupabaseClient } from "@supabase/supabase-js";
import type {
  UploadMediaInput,
  IStorageUploadService,
} from "../productoStorage.model";
import {
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
  BUCKET_NAME,
} from "../productoStorage.model";
import { generateErrorDictionary } from "./storageUpload.dictionary";

/**
 * Servicio para subir archivos multimedia (imágenes y videos) a Supabase Storage
 */
export class StorageUploadService implements IStorageUploadService {
  constructor(private readonly supabaseClient: SupabaseClient) {}

  /**
   * Valida el tipo de archivo (imagen o video)
   */
  private isValidMediaType(contentType: string): boolean {
    return (
      ALLOWED_IMAGE_TYPES.includes(contentType) ||
      ALLOWED_VIDEO_TYPES.includes(contentType)
    );
  }

  /**
   * Sube un archivo multimedia y retorna la URL pública
   */
  async execute(input: UploadMediaInput): Promise<string> {
    const { file, fileName, contentType = "image/jpeg" } = input;

    // Validar tipo de archivo
    if (!this.isValidMediaType(contentType)) {
      const error = generateErrorDictionary("INVALID_FILE_TYPE");
      throw new Error(JSON.stringify(error));
    }

    // Generar nombre único para el archivo
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(7);
    const uniqueFileName = `${timestamp}-${randomString}-${fileName}`;

    // Determinar carpeta según tipo de archivo
    const isVideo = ALLOWED_VIDEO_TYPES.includes(contentType);
    const folder = isVideo ? "videos" : "imagenes";
    const filePath = `${folder}/${uniqueFileName}`;

    // Si es base64, convertir a Buffer
    let fileBuffer: Buffer;
    if (typeof file === "string") {
      // Remover prefijo data:image/xxx;base64, o data:video/xxx;base64, si existe
      const base64Data = file.replace(/^data:(image|video)\/\w+;base64,/, "");
      fileBuffer = Buffer.from(base64Data, "base64");
    } else {
      fileBuffer = file;
    }

    // Subir archivo a Supabase Storage
    const { data, error } = await this.supabaseClient.storage
      .from(BUCKET_NAME)
      .upload(filePath, fileBuffer, {
        contentType,
        upsert: false,
      });

    if (error) {
      const errorDict = generateErrorDictionary("ERROR_UPLOADING");
      throw new Error(JSON.stringify(errorDict));
    }

    // Obtener URL pública
    const {
      data: { publicUrl },
    } = this.supabaseClient.storage.from(BUCKET_NAME).getPublicUrl(filePath);

    return publicUrl;
  }

  /**
   * Sube múltiples archivos multimedia y retorna array de URLs
   */
  async executeMultiple(files: UploadMediaInput[]): Promise<string[]> {
    const uploadPromises = files.map((file) => this.execute(file));
    return Promise.all(uploadPromises);
  }
}

