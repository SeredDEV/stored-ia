import { Request, Response, NextFunction } from "express";
import { ICategoriaGetService } from "../../../../services/producto/categoria/get/categoriaGet.service";

export class CategoriaGetController {
  constructor(private readonly categoriaService: ICategoriaGetService) {}

  public get = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const categoria = await this.categoriaService.execute(req.params.id);
      res.json({ data: categoria });
    } catch (err: any) {
      next(err);
    }
  };
}
