import { Request, Response, NextFunction } from "express";
import { IColeccionGetService } from "../../../../services/producto/coleccion/get/coleccionGet.service";

export class ColeccionGetController {
  constructor(private readonly coleccionService: IColeccionGetService) {}

  public get = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const coleccion = await this.coleccionService.execute(req.params.id);
      res.json({ data: coleccion });
    } catch (err: any) {
      next(err);
    }
  };
}

