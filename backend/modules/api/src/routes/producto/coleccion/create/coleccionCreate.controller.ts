import { Request, Response, NextFunction } from "express";
import { IColeccionCreateService } from "../../../../services/producto/coleccion/create/coleccionCreate.service";
import { CreateColeccionInput } from "./coleccionCreate.validator";

export class ColeccionCreateController {
  constructor(private readonly coleccionService: IColeccionCreateService) {}

  public create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const input = req.body as CreateColeccionInput;
      const coleccion = await this.coleccionService.create(input);
      res.status(201).json({ data: coleccion });
    } catch (err: any) {
      next(err);
    }
  };
}

