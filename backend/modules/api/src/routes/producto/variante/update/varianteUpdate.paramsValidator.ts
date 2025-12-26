import { z } from "zod";
import { RouteValidator } from "../../../../lib/routeValidator";

const updateVarianteParamsSchema = z.object({
  id: z.string().uuid("El ID debe ser un UUID válido"),
});

export type UpdateVarianteParams = z.infer<typeof updateVarianteParamsSchema>;

export class VarianteUpdateParamsValidator {
  public validateParams = RouteValidator.params(updateVarianteParamsSchema);
}
