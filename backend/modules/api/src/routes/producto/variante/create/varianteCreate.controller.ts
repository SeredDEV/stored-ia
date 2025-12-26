import { Request, Response, NextFunction } from "express";
import { IVarianteCreateService } from "../../../../services/producto/variante/create/varianteCreate.service";
import { CreateVarianteInput } from "./varianteCreate.validator";

export class VarianteCreateController {
  constructor(private readonly varianteService: IVarianteCreateService) {}

  public create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const input = req.body as CreateVarianteInput;
      const variante = await this.varianteService.execute(input);
      res.status(201).json({ data: variante });
    } catch (err: any) {
      next(err);
    }
  };
}

