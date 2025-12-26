import { z } from "zod";
import { RouteValidator } from "../../../../lib/routeValidator";

const listVarianteParamsSchema = z.object({
  producto_id: z.string().uuid("El producto_id debe ser un UUID válido"),
});

export type ListVarianteParams = z.infer<typeof listVarianteParamsSchema>;

export class VarianteListValidator {
  public validateParams = RouteValidator.params(listVarianteParamsSchema);
}
