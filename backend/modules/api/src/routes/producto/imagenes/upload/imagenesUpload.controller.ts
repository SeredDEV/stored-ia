import type { Request, Response, NextFunction } from "express";
import type { UploadImagenesParams } from "./imagenesUpload.validator";
import type { StorageUploadService } from "../../../../services/producto/storage/upload/storageUpload.service";
import type { SupabaseClient } from "@supabase/supabase-js";

export class ImagenesUploadController {
  constructor(
    private readonly storageService: StorageUploadService,
    private readonly supabaseClient: SupabaseClient
  ) {}

  upload = async (
    req: Request<UploadImagenesParams>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        res.status(400).json({ error: "No se enviaron imágenes" });
        return;
      }

      console.log("=== Subiendo imágenes ===");
      console.log("Producto ID:", id);
      console.log("Cantidad de imágenes:", files.length);

      // 1. Verificar que el producto existe
      const { data: producto, error: productoError } = await this.supabaseClient
        .from("producto")
        .select("imagenes")
        .eq("id", id)
        .is("fecha_eliminacion", null)
        .single();

      if (productoError || !producto) {
        res.status(404).json({ error: "Producto no encontrado" });
        return;
      }

      // 2. Subir imágenes a storage
      const imagenesActuales = (producto.imagenes as string[]) || [];
      const nuevasUrls: string[] = [];

      for (const file of files) {
        const publicUrl = await this.storageService.execute({
          file: file.buffer,
          fileName: file.originalname,
          contentType: file.mimetype,
        });
        nuevasUrls.push(publicUrl);
        console.log(`URL guardada: ${publicUrl}`);
      }

      // 3. Actualizar producto con nuevas URLs
      const todasLasImagenes = [...imagenesActuales, ...nuevasUrls];

      const { error: updateError } = await this.supabaseClient
        .from("producto")
        .update({ imagenes: todasLasImagenes })
        .eq("id", id);

      if (updateError) {
        console.error("Error al actualizar producto:", updateError);
        res.status(500).json({ error: "Error al actualizar producto" });
        return;
      }

      res.status(200).json({
        message: "Imágenes subidas exitosamente",
        cantidad: nuevasUrls.length,
        urls: nuevasUrls,
      });
    } catch (error) {
      next(error);
    }
  };
}
