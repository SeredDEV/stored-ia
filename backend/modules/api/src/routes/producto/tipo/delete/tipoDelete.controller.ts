import { Request, Response, NextFunction } from "express";
import { ITipoDeleteService } from "../../../../services/producto/tipo/delete/tipoDelete.service";

export class TipoDeleteController {
  constructor(private readonly tipoService: ITipoDeleteService) {}

  public delete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await this.tipoService.execute(req.params.id);
      res.status(204).send();
    } catch (err: any) {
      next(err);
    }
  };
}

