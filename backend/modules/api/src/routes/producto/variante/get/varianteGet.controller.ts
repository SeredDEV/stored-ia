import { Request, Response, NextFunction } from "express";
import { IVarianteGetService } from "../../../../services/producto/variante/get/varianteGet.service";

export class VarianteGetController {
  constructor(private readonly varianteService: IVarianteGetService) {}

  public get = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const variante = await this.varianteService.execute(req.params.id);
      if (!variante) {
        res.status(404).json({ error: "Variante no encontrada" });
        return;
      }
      res.json({ data: variante });
    } catch (err: any) {
      next(err);
    }
  };
}

