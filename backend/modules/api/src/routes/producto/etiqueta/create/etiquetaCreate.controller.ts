import { Request, Response, NextFunction } from "express";
import { IEtiquetaCreateService } from "../../../../services/producto/etiqueta/create/etiquetaCreate.service";
import { CreateEtiquetaInput } from "./etiquetaCreate.validator";

export class EtiquetaCreateController {
  constructor(private readonly etiquetaService: IEtiquetaCreateService) {}

  public create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const input = req.body as CreateEtiquetaInput;
      const etiqueta = await this.etiquetaService.execute(input);
      res.status(201).json({ data: etiqueta });
    } catch (err: any) {
      next(err);
    }
  };
}

