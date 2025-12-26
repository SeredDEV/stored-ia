import { Request, Response, NextFunction } from "express";
import { ITipoGetService } from "../../../../services/producto/tipo/get/tipoGet.service";

export class TipoGetController {
  constructor(private readonly tipoService: ITipoGetService) {}

  public get = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tipo = await this.tipoService.execute(req.params.id);
      if (!tipo) {
        res.status(404).json({ error: "Tipo de producto no encontrado" });
        return;
      }
      res.json({ data: tipo });
    } catch (err: any) {
      next(err);
    }
  };
}

