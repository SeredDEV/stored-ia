import type { Request, Response, NextFunction } from "express";
import type { IEtiquetaRemoveService } from "../../../../services/producto/etiqueta/remove-from-producto";
import type { EtiquetaRemoveParams } from "./etiquetaRemove.validator";

export class EtiquetaRemoveController {
  constructor(private readonly service: IEtiquetaRemoveService) {}

  remove = async (
    req: Request<EtiquetaRemoveParams>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id, etiqueta_id } = req.params;

      await this.service.execute({
        producto_id: id,
        etiqueta_id,
      });

      res.status(200).json({
        message: "Etiqueta removida exitosamente",
      });
    } catch (error) {
      next(error);
    }
  };
}
