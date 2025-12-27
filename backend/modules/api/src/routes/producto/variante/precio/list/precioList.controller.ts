import type { Request, Response } from "express";
import type { IPrecioListService } from "../../../../../services/producto/variante/precio/list/precioList.service";

export class PrecioListController {
  constructor(private precioService: IPrecioListService) {
    this.list = this.list.bind(this);
  }

  async list(req: Request, res: Response): Promise<void> {
    try {
      const { variante_id } = req.params;
      const precios = await this.precioService.execute(variante_id);
      res.status(200).json({ data: precios });
    } catch (error) {
      if (error instanceof Error) {
        try {
          const parsedError = JSON.parse(error.message);
          res.status(parsedError.statusCode || 500).json({
            error: parsedError.message || "Error al obtener los precios",
          });
        } catch {
          res.status(500).json({
            error: "Error al obtener los precios",
          });
        }
      } else {
        res.status(500).json({
          error: "Error al obtener los precios",
        });
      }
    }
  }
}
