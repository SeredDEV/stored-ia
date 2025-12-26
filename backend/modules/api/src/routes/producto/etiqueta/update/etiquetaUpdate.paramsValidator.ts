import { z } from "zod";
import { RouteValidator } from "../../../../lib/routeValidator";

const updateEtiquetaParamsSchema = z.object({
  id: z.string().uuid("El ID debe ser un UUID válido"),
});

export type UpdateEtiquetaParams = z.infer<typeof updateEtiquetaParamsSchema>;

export class EtiquetaUpdateParamsValidator {
  public validateParams = RouteValidator.params(updateEtiquetaParamsSchema);
}
