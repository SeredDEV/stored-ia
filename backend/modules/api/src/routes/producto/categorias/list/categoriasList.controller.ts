import type { Request, Response, NextFunction } from "express";
import type { ICategoriaListByProductoService } from "../../../../services/producto/categoria/list-by-producto";
import type { CategoriasListParams } from "./categoriasList.validator";

export class CategoriasListController {
  constructor(private readonly service: ICategoriaListByProductoService) {}

  list = async (
    req: Request<CategoriasListParams>,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const categorias = await this.service.execute(id);

      res.status(200).json({ data: categorias });
    } catch (error) {
      next(error);
    }
  };
}
