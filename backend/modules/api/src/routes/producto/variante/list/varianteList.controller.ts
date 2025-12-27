import { Request, Response, NextFunction } from "express";
import { IVarianteListService } from "../../../../services/producto/variante/list/varianteList.service";

export class VarianteListController {
  constructor(private readonly varianteService: IVarianteListService) {}

  public listByProducto = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { producto_id } = req.params;
      const variantes = await this.varianteService.execute(
        producto_id
      );
      res.json({ data: variantes });
    } catch (err: any) {
      next(err);
    }
  };
}

