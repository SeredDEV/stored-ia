import type { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";
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
        .select("miniatura, slug, titulo")
        .eq("id", id)
        .is("fecha_eliminacion", null)
        .single();

      if (productoError) {
        console.error("Error consultando producto:", productoError);
        res.status(500).json({ error: "Error consultando producto" });
        return;
      }

      if (!producto) {
        res.status(404).json({ error: "Producto no encontrado" });
        return;
      }

      // 2. Subir imágenes a storage
      const nuevasUrls: string[] = [];

      const folder = producto.slug || producto.titulo || id;

      for (const file of files) {
        const publicUrl = await this.storageService.execute({
          file: file.buffer,
          fileName: file.originalname,
          contentType: file.mimetype,
          folder,
        });
        nuevasUrls.push(publicUrl);
        console.log(`URL guardada: ${publicUrl}`);

        // Crear registro en imagen_producto
        const { error: imagenInsertError } = await this.supabaseClient
          .from("imagen_producto")
          .insert({
            id: randomUUID(),
            producto_id: id,
            url: publicUrl,
            rango: nuevasUrls.length, // posición
            metadatos: {
              originalName: file.originalname,
              mimetype: file.mimetype,
              size: file.size,
            },
          });

        if (imagenInsertError) {
          console.error(
            "Error al insertar en imagen_producto:",
            imagenInsertError
          );
          res
            .status(500)
            .json({ error: "Error al guardar imagen del producto" });
          return;
        }
      }

      // 3. Actualizar miniatura del producto si no tiene
      const miniatura = producto.miniatura || nuevasUrls[0] || null;

      const { error: updateError } = await this.supabaseClient
        .from("producto")
        .update({
          miniatura,
        })
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
