import { Request, Response, NextFunction } from "express";
import { IEtiquetaDeleteService } from "../../../../services/producto/etiqueta/delete/etiquetaDelete.service";

export class EtiquetaDeleteController {
  constructor(private readonly etiquetaService: IEtiquetaDeleteService) {}

  public delete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await this.etiquetaService.execute(req.params.id);
      res.status(204).send();
    } catch (err: any) {
      next(err);
    }
  };
}

