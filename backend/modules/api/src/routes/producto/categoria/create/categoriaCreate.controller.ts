import { Request, Response, NextFunction } from "express";
import { ICategoriaCreateService } from "../../../../services/producto/categoria/create/categoriaCreate.service";
import { CreateCategoriaInput } from "./categoriaCreate.validator";

export class CategoriaCreateController {
  constructor(private readonly categoriaService: ICategoriaCreateService) {}

  public create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const input = req.body as CreateCategoriaInput;
      const categoria = await this.categoriaService.create(input);
      res.status(201).json({ data: categoria });
    } catch (err: any) {
      next(err);
    }
  };
}
