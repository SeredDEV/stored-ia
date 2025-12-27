import { Request, Response, NextFunction } from "express";
import { IProductoCreateService } from "../../../services/producto/productoModel";
import { CreateProductoInput } from "./productoCreate.validator";

export class ProductoCreateController {
  constructor(private readonly productoService: IProductoCreateService) {}

  public create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const files = req.files as {
        [fieldname: string]: Express.Multer.File[];
      };

      // Construir el input procesando los archivos
      const input: CreateProductoInput = {
        titulo: req.body.titulo,
        subtitulo: req.body.subtitulo,
        descripcion: req.body.descripcion,
        slug: req.body.slug,
        tiene_descuento: req.body.tiene_descuento === "true",
        tiene_variantes: req.body.tiene_variantes === "true" || false,
        estado: req.body.estado || "borrador", // Procesar el estado
        tipo_producto_id: req.body.tipo_producto_id,
        coleccion_id: req.body.coleccion_id,
        categorias: req.body.categorias
          ? JSON.parse(req.body.categorias)
          : undefined,
        etiquetas: req.body.etiquetas
          ? JSON.parse(req.body.etiquetas)
          : undefined,
      };

      // Procesar miniatura si existe
      if (files?.miniatura && files.miniatura[0]) {
        const file = files.miniatura[0];
        input.miniatura = {
          buffer: file.buffer.toString("base64"),
          fileName: file.originalname,
          contentType: file.mimetype,
        };
      }

      // Procesar imágenes si existen
      if (files?.imagenes && files.imagenes.length > 0) {
        input.imagenes = files.imagenes.map((file) => ({
          buffer: file.buffer.toString("base64"),
          fileName: file.originalname,
          contentType: file.mimetype,
        }));
      }

      const producto = await this.productoService.createProducto(input);

      res.status(201).json({
        data: {
          producto,
        },
      });
    } catch (err: any) {
      next(err);
    }
  };
}
