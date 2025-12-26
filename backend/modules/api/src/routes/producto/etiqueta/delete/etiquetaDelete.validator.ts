import { z } from "zod";
import { RouteValidator } from "../../../../lib/routeValidator";

const deleteEtiquetaParamsSchema = z.object({
  id: z.string().uuid("El ID debe ser un UUID válido"),
});

export type DeleteEtiquetaParams = z.infer<typeof deleteEtiquetaParamsSchema>;

export class EtiquetaDeleteValidator {
  public validateParams = RouteValidator.params(deleteEtiquetaParamsSchema);
}
