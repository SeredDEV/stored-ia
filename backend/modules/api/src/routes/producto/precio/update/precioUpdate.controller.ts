import { Request, Response, NextFunction } from "express";
import { IPrecioUpdateService } from "../../../../services/producto/precio/update/precioUpdate.service";
import { UpdatePrecioInput } from "./precioUpdate.validator";

export class PrecioUpdateController {
  constructor(private readonly precioService: IPrecioUpdateService) {}

  public update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const input = req.body as UpdatePrecioInput;
      const precio = await this.precioService.execute(req.params.id, input);
      res.json({ data: precio });
    } catch (err: any) {
      next(err);
    }
  };
}
