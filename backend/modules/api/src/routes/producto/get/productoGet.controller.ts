import { Request, Response, NextFunction } from "express";
import { IProductoGetService } from "../../../services/producto/get/productoGet.service";

export class ProductoGetController {
  constructor(private readonly productoService: IProductoGetService) {}

  public get = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const producto = await this.productoService.execute(req.params.id);
      res.json({ data: producto });
    } catch (err: any) {
      next(err);
    }
  };
}

