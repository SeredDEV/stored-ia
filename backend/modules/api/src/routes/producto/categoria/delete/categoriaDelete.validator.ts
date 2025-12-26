import { z } from "zod";
import { RouteValidator } from "../../../../lib/routeValidator";

const deleteCategoriaParamsSchema = z.object({
  id: z.string().uuid("El ID debe ser un UUID válido"),
});

export type DeleteCategoriaParams = z.infer<typeof deleteCategoriaParamsSchema>;

export class CategoriaDeleteValidator {
  public validateParams = RouteValidator.params(deleteCategoriaParamsSchema);
}
