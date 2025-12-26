import { Request, Response, NextFunction } from "express";
import { IProductoUpdateService, UpdateProductoInput } from "../../../services/producto/update/productoUpdate.service";

export class ProductoUpdateController {
  constructor(private readonly productoService: IProductoUpdateService) {}

  public update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const input = req.body as UpdateProductoInput;
      const producto = await this.productoService.execute(req.params.id, input);
      res.json({ data: producto });
    } catch (err: any) {
      next(err);
    }
  };
}

