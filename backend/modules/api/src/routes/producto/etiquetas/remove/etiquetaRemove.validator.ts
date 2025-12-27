import { z } from "zod";
import { RouteValidator } from "../../../../lib/routeValidator";

const etiquetaRemoveParamsSchema = z.object({
  id: z.string().uuid("El ID del producto debe ser un UUID válido"),
  etiqueta_id: z.string().uuid("El ID de la etiqueta debe ser un UUID válido"),
});

export type EtiquetaRemoveParams = z.infer<typeof etiquetaRemoveParamsSchema>;

export class EtiquetaRemoveValidator {
  public validateParams = RouteValidator.params(etiquetaRemoveParamsSchema);
}
