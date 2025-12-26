import { Request, Response, NextFunction } from "express";
import { IEtiquetaUpdateService } from "../../../../services/producto/etiqueta/update/etiquetaUpdate.service";
import { UpdateEtiquetaInput } from "./etiquetaUpdate.validator";

export class EtiquetaUpdateController {
  constructor(private readonly etiquetaService: IEtiquetaUpdateService) {}

  public update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const input = req.body as UpdateEtiquetaInput;
      const etiqueta = await this.etiquetaService.execute(
        req.params.id,
        input
      );
      res.json({ data: etiqueta });
    } catch (err: any) {
      next(err);
    }
  };
}

