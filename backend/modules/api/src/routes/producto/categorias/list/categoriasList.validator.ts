import { z } from "zod";
import { RouteValidator } from "../../../../lib/routeValidator";

const categoriasListParamsSchema = z.object({
  id: z.string().uuid("El ID del producto debe ser un UUID válido"),
});

export type CategoriasListParams = z.infer<typeof categoriasListParamsSchema>;

export class CategoriasListValidator {
  public validateParams = RouteValidator.params(categoriasListParamsSchema);
}
