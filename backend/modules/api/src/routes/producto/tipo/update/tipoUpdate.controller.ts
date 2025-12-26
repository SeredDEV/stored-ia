import { Request, Response, NextFunction } from "express";
import { ITipoUpdateService } from "../../../../services/producto/tipo/update/tipoUpdate.service";
import { UpdateTipoInput } from "./tipoUpdate.validator";

export class TipoUpdateController {
  constructor(private readonly tipoService: ITipoUpdateService) {}

  public update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const input = req.body as UpdateTipoInput;
      const tipo = await this.tipoService.execute(req.params.id, input);
      res.json({ data: tipo });
    } catch (err: any) {
      next(err);
    }
  };
}

