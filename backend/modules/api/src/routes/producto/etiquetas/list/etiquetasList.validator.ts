import { z } from "zod";
import { RouteValidator } from "../../../../lib/routeValidator";

const etiquetasListParamsSchema = z.object({
  id: z.string().uuid("El ID del producto debe ser un UUID válido"),
});

export type EtiquetasListParams = z.infer<typeof etiquetasListParamsSchema>;

export class EtiquetasListValidator {
  public validateParams = RouteValidator.params(etiquetasListParamsSchema);
}
