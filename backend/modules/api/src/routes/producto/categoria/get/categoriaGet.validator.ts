import { z } from "zod";
import { RouteValidator } from "../../../../lib/routeValidator";

const getCategoriaParamsSchema = z.object({
  id: z.string().uuid("El ID debe ser un UUID válido"),
});

export type GetCategoriaParams = z.infer<typeof getCategoriaParamsSchema>;

export class CategoriaGetValidator {
  public validateParams = RouteValidator.params(getCategoriaParamsSchema);
}
