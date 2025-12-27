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
      // El body ya viene validado y transformado por Zod
      const input: CreateProductoInput = req.body;

      console.log("=== Creando producto ===");
      console.log("Input recibido:", input);

      const producto = await this.productoService.createProducto(input);

      console.log("=== Producto creado exitosamente ===");
      console.log("Producto:", producto);

      res.status(201).json({
        data: {
          producto,
        },
      });
    } catch (err: any) {
      console.error("=== ERROR en controlador ===");
      console.error("Error completo:", err);
      console.error("Mensaje:", err.message);
      console.error("Stack:", err.stack);
      next(err);
    }
  };
}
