import { Request, Response, NextFunction } from "express";
import { IProductoListService } from "../../../services/producto/list/productoList.service";

export class ProductoListController {
  constructor(private readonly productoService: IProductoListService) {}

  public list = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const {
        activo,
        tiene_variantes,
        tipo_producto_id,
        coleccion_id,
        estado,
      } = req.query;
      const filters: any = {};

      if (activo !== undefined) filters.activo = activo === "true";
      if (tiene_variantes !== undefined)
        filters.tiene_variantes = tiene_variantes === "true";
      if (tipo_producto_id)
        filters.tipo_producto_id = tipo_producto_id as string;
      if (coleccion_id) filters.coleccion_id = coleccion_id as string;
      if (estado) filters.estado = estado as string;

      const productos = await this.productoService.execute(filters);
      res.json({ data: productos });
    } catch (err: any) {
      next(err);
    }
  };
}
