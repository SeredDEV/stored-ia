import { Request, Response, NextFunction } from "express";
import { IColeccionUpdateService } from "../../../../services/producto/coleccion/update/coleccionUpdate.service";
import { UpdateColeccionInput } from "./coleccionUpdate.validator";

export class ColeccionUpdateController {
  constructor(private readonly coleccionService: IColeccionUpdateService) {}

  public update = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const input = req.body as UpdateColeccionInput;
      const coleccion = await this.coleccionService.update(
        req.params.id,
        input
      );
      res.json({ data: coleccion });
    } catch (err: any) {
      next(err);
    }
  };
}

