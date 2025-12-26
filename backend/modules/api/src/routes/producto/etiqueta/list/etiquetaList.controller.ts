import { Request, Response, NextFunction } from "express";
import { IEtiquetaListService } from "../../../../services/producto/etiqueta/list/etiquetaList.service";

export class EtiquetaListController {
  constructor(private readonly etiquetaService: IEtiquetaListService) {}

  public list = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const etiquetas = await this.etiquetaService.execute();
      res.json({ data: etiquetas });
    } catch (err: any) {
      next(err);
    }
  };
}

