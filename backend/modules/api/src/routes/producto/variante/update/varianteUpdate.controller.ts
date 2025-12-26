import { Request, Response, NextFunction } from "express";
import { IVarianteUpdateService } from "../../../../services/producto/variante/update/varianteUpdate.service";
import { UpdateVarianteInput } from "./varianteUpdate.validator";

export class VarianteUpdateController {
  constructor(private readonly varianteService: IVarianteUpdateService) {}

  public update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const input = req.body as UpdateVarianteInput;
      const variante = await this.varianteService.execute(
        req.params.id,
        input
      );
      res.json({ data: variante });
    } catch (err: any) {
      next(err);
    }
  };
}

