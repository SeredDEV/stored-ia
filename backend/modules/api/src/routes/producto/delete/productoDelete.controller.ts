import { Request, Response, NextFunction } from "express";
import { IProductoDeleteService } from "../../../services/producto/delete/productoDelete.service";

export class ProductoDeleteController {
  constructor(private readonly productoService: IProductoDeleteService) {}

  public delete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await this.productoService.execute(req.params.id);
      res.status(204).send();
    } catch (err: any) {
      next(err);
    }
  };
}

