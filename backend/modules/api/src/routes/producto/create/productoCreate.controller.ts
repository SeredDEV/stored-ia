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
