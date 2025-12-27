import { z } from "zod";
import { RouteValidator } from "../../../../lib/routeValidator";

const categoriaRemoveParamsSchema = z.object({
  id: z.string().uuid("El ID del producto debe ser un UUID válido"),
  categoria_id: z
    .string()
    .uuid("El ID de la categoría debe ser un UUID válido"),
});

export type CategoriaRemoveParams = z.infer<typeof categoriaRemoveParamsSchema>;

export class CategoriaRemoveValidator {
  public validateParams = RouteValidator.params(categoriaRemoveParamsSchema);
}
