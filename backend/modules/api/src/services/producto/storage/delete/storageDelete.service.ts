import { SupabaseClient } from "@supabase/supabase-js";
import type { IStorageDeleteService } from "../productoStorage.model";
import { BUCKET_NAME } from "../productoStorage.model";
import { generateErrorDictionary } from "./storageDelete.dictionary";

/**
 * Servicio para eliminar archivos multimedia de Supabase Storage
 */
export class StorageDeleteService implements IStorageDeleteService {
  constructor(private readonly supabaseClient: SupabaseClient) {}

  /**
   * Elimina un archivo multimedia de Supabase Storage
   */
  async execute(mediaUrl: string): Promise<void> {
    try {
      // Extraer el path del archivo desde la URL
      const urlObj = new URL(mediaUrl);
      const pathParts = urlObj.pathname.split(`/${BUCKET_NAME}/`);
      
      if (pathParts.length < 2) {
        const error = generateErrorDictionary("INVALID_URL");
        throw new Error(JSON.stringify(error));
      }
      
      const filePath = pathParts[1];

      const { error } = await this.supabaseClient.storage
        .from(BUCKET_NAME)
        .remove([filePath]);

      if (error) {
        const errorDict = generateErrorDictionary("ERROR_DELETING");
        throw new Error(JSON.stringify(errorDict));
      }
    } catch (error: any) {
      // Si ya es un error del diccionario, re-lanzarlo
      if (error.message.includes("dictionaryId")) {
        throw error;
      }
      
      const errorDict = generateErrorDictionary("ERROR_DELETING");
      throw new Error(JSON.stringify(errorDict));
    }
  }

  /**
   * Elimina múltiples archivos multimedia
   */
  async executeMultiple(mediaUrls: string[]): Promise<void> {
    const deletePromises = mediaUrls.map((url) => this.execute(url));
    await Promise.all(deletePromises);
  }
}

