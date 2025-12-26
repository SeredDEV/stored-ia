import { Request, Response, NextFunction } from "express";
import { ICategoriaDeleteService } from "../../../../services/producto/categoria/delete/categoriaDelete.service";

export class CategoriaDeleteController {
  constructor(private readonly categoriaService: ICategoriaDeleteService) {}

  public delete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await this.categoriaService.delete(req.params.id);
      res.status(204).send();
    } catch (err: any) {
      next(err);
    }
  };
}
