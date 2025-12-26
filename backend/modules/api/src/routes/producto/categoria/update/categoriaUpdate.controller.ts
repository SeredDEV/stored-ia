import { Request, Response, NextFunction } from "express";
import { ICategoriaUpdateService } from "../../../../services/producto/categoria/update/categoriaUpdate.service";
import { UpdateCategoriaInput } from "./categoriaUpdate.validator";

export class CategoriaUpdateController {
  constructor(private readonly categoriaService: ICategoriaUpdateService) {}

  public update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const input = req.body as UpdateCategoriaInput;
      const categoria = await this.categoriaService.update(
        req.params.id,
        input
      );
      res.json({ data: categoria });
    } catch (err: any) {
      next(err);
    }
  };
}

