import { Request, Response, NextFunction } from "express";
import { IVarianteDeleteService } from "../../../../services/producto/variante/delete/varianteDelete.service";

export class VarianteDeleteController {
  constructor(private readonly varianteService: IVarianteDeleteService) {}

  public delete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await this.varianteService.execute(req.params.id);
      res.status(204).send();
    } catch (err: any) {
      next(err);
    }
  };
}

