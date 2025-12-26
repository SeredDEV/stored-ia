import { Request, Response, NextFunction } from "express";
import { ICategoriaListService } from "../../../../services/producto/categoria/list/categoriaList.service";

export class CategoriaListController {
  constructor(private readonly categoriaService: ICategoriaListService) {}

  public list = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { activa, categoria_padre_id } = req.query;
      const filters: any = {};

      if (activa !== undefined) filters.activa = activa === "true";
      if (categoria_padre_id) filters.categoria_padre_id = categoria_padre_id as string;

      const categorias = await this.categoriaService.list(filters);
      res.json({ data: categorias });
    } catch (err: any) {
      next(err);
    }
  };
}

