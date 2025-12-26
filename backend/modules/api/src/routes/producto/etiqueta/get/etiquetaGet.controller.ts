import { Request, Response, NextFunction } from "express";
import { IEtiquetaGetService } from "../../../../services/producto/etiqueta/get/etiquetaGet.service";

export class EtiquetaGetController {
  constructor(private readonly etiquetaService: IEtiquetaGetService) {}

  public get = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const etiqueta = await this.etiquetaService.execute(req.params.id);
      if (!etiqueta) {
        res.status(404).json({ error: "Etiqueta no encontrada" });
        return;
      }
      res.json({ data: etiqueta });
    } catch (err: any) {
      next(err);
    }
  };
}

