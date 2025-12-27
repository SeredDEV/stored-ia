import type { Request, Response, NextFunction } from "express";
import type { IEtiquetaAssignService } from "../../../../services/producto/etiqueta/assign";
import type {
  EtiquetasAssignBody,
  EtiquetasAssignParams,
} from "./etiquetasAssign.validator";

export class EtiquetasAssignController {
  constructor(private readonly service: IEtiquetaAssignService) {}

  assign = async (
    req: Request<EtiquetasAssignParams, unknown, EtiquetasAssignBody>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const { etiqueta_ids } = req.body;

      await this.service.execute({
        producto_id: id,
        etiqueta_ids,
      });

      res.status(200).json({
        message: "Etiquetas asignadas exitosamente",
      });
    } catch (error) {
      next(error);
    }
  };
}
