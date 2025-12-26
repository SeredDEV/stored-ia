import { Request, Response, NextFunction } from "express";
import { IColeccionListService } from "../../../../services/producto/coleccion/list/coleccionList.service";

export class ColeccionListController {
  constructor(private readonly coleccionService: IColeccionListService) {}

  public list = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const colecciones = await this.coleccionService.list();
      res.json({ data: colecciones });
    } catch (err: any) {
      next(err);
    }
  };
}

