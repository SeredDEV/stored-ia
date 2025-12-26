import { Request, Response, NextFunction } from "express";
import { IColeccionDeleteService } from "../../../../services/producto/coleccion/delete/coleccionDelete.service";

export class ColeccionDeleteController {
  constructor(private readonly coleccionService: IColeccionDeleteService) {}

  public delete = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      await this.coleccionService.delete(req.params.id);
      res.status(204).send();
    } catch (err: any) {
      next(err);
    }
  };
}

