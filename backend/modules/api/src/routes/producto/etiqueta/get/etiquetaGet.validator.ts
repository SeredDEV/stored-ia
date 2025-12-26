import { z } from "zod";
import { RouteValidator } from "../../../../lib/routeValidator";

const getEtiquetaParamsSchema = z.object({
  id: z.string().uuid("El ID debe ser un UUID válido"),
});

export type GetEtiquetaParams = z.infer<typeof getEtiquetaParamsSchema>;

export class EtiquetaGetValidator {
  public validateParams = RouteValidator.params(getEtiquetaParamsSchema);
}
