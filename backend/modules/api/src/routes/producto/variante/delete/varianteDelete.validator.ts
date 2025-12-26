import { z } from "zod";
import { RouteValidator } from "../../../../lib/routeValidator";

const deleteVarianteParamsSchema = z.object({
  id: z.string().uuid("El ID debe ser un UUID válido"),
});

export type DeleteVarianteParams = z.infer<typeof deleteVarianteParamsSchema>;

export class VarianteDeleteValidator {
  public validateParams = RouteValidator.params(deleteVarianteParamsSchema);
}
