import { Request, Response, NextFunction } from "express";
import { IPrecioCreateService } from "../../../../../services/producto/variante/precio/create/precioCreate.service";
import { CreatePrecioInput } from "./precioCreate.validator";

export class PrecioCreateController {
  constructor(private readonly precioService: IPrecioCreateService) {}

  public create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { variante_id } = req.params;
      const input: CreatePrecioInput = req.body;

      const precio = await this.precioService.execute({
        variante_id,
        ...input,
      });

      res.status(201).json({ data: precio });
    } catch (err: any) {
      next(err);
    }
  };
}
