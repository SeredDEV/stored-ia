import type { Request, Response, NextFunction } from "express";
import type { ICategoriaAssignService } from "../../../../services/producto/categoria/assign";
import type {
  CategoriasAssignBody,
  CategoriasAssignParams,
} from "./categoriasAssign.validator";

export class CategoriasAssignController {
  constructor(private readonly service: ICategoriaAssignService) {}

  assign = async (
    req: Request<CategoriasAssignParams, unknown, CategoriasAssignBody>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const { categoria_ids } = req.body;

      await this.service.execute({
        producto_id: id,
        categoria_ids,
      });

      res.status(200).json({
        message: "Categorías asignadas exitosamente",
      });
    } catch (error) {
      next(error);
    }
  };
}
