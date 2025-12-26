import { Request, Response, NextFunction } from "express";
import { ITipoCreateService } from "../../../../services/producto/tipo/create/tipoCreate.service";
import { CreateTipoInput } from "./tipoCreate.validator";

export class TipoCreateController {
  constructor(private readonly tipoService: ITipoCreateService) {}

  public create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const input = req.body as CreateTipoInput;
      const tipo = await this.tipoService.execute(input);
      res.status(201).json({ data: tipo });
    } catch (err: any) {
      next(err);
    }
  };
}

