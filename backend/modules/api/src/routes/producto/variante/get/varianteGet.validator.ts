import { z } from "zod";
import { RouteValidator } from "../../../../lib/routeValidator";

const getVarianteParamsSchema = z.object({
  id: z.string().uuid("El ID debe ser un UUID válido"),
});

export type GetVarianteParams = z.infer<typeof getVarianteParamsSchema>;

export class VarianteGetValidator {
  public validateParams = RouteValidator.params(getVarianteParamsSchema);
}
