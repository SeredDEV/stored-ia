import { Request, Response, NextFunction } from "express";
import { ITipoListService } from "../../../../services/producto/tipo/list/tipoList.service";

export class TipoListController {
  constructor(private readonly tipoService: ITipoListService) {}

  public list = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const tipos = await this.tipoService.execute();
      res.json({ data: tipos });
    } catch (err: any) {
      next(err);
    }
  };
}

