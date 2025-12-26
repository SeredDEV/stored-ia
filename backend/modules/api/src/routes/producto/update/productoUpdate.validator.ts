import { z } from "zod";
import { RouteValidator } from "../../../lib/routeValidator";

const bodySchema = z.object({
  titulo: z.string().min(1, "El título es requerido").optional(),
  subtitulo: z.string().optional(),
  descripcion: z.string().optional(),
  slug: z.string().optional(),
  activo: z.boolean().optional(),
  tiene_descuento: z.boolean().optional(),
  tipo_producto_id: z.string().uuid("ID de tipo de producto inválido").optional(),
  coleccion_id: z.string().uuid("ID de colección inválido").optional(),
});

const paramsSchema = z.object({
  id: z.string().uuid("ID de producto inválido"),
});

export class ProductoUpdateValidator {
  public static create() {
    return {
      validateBody: RouteValidator.create(bodySchema),
      validateParams: RouteValidator.params(paramsSchema),
    };
  }
}

export type UpdateProductoInput = z.infer<typeof bodySchema>;

