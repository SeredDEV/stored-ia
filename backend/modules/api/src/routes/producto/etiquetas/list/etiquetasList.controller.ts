import type { Request, Response, NextFunction } from "express";
import type { IEtiquetaListByProductoService } from "../../../../services/producto/etiqueta/list-by-producto";
import type { EtiquetasListParams } from "./etiquetasList.validator";

export class EtiquetasListController {
  constructor(private readonly service: IEtiquetaListByProductoService) {}

  list = async (
    req: Request<EtiquetasListParams>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const etiquetas = await this.service.execute(id);

      res.status(200).json({ data: etiquetas });
    } catch (error) {
      next(error);
    }
  };
}
