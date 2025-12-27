import { Request, Response, NextFunction } from "express";
import { IPrecioListService } from "../../../../../services/producto/variante/precio/list/precioList.service";

export class PrecioListController {
  constructor(private readonly precioService: IPrecioListService) {}

  public list = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { variante_id } = req.params;
      const precios = await this.precioService.execute(variante_id);
      res.json({ data: precios });
    } catch (err: any) {
      next(err);
    }
  };
}
