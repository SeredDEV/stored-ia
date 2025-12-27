import type { Request, Response, NextFunction } from "express";
import type { ICategoriaRemoveService } from "../../../../services/producto/categoria/remove-from-producto";
import type { CategoriaRemoveParams } from "./categoriaRemove.validator";

export class CategoriaRemoveController {
  constructor(private readonly service: ICategoriaRemoveService) {}

  remove = async (
    req: Request<CategoriaRemoveParams>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id, categoria_id } = req.params;

      await this.service.execute({
        producto_id: id,
        categoria_id,
      });

      res.status(200).json({
        message: "Categoría removida exitosamente",
      });
    } catch (error) {
      next(error);
    }
  };
}
