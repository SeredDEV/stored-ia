import { z } from "zod";
import { RouteValidator } from "../../../../lib/routeValidator";

const updateCategoriaParamsSchema = z.object({
  id: z.string().uuid("El ID debe ser un UUID válido"),
});

export type UpdateCategoriaParams = z.infer<typeof updateCategoriaParamsSchema>;

export class CategoriaUpdateParamsValidator {
  public validateParams = RouteValidator.params(updateCategoriaParamsSchema);
}
