import { z } from "zod";
import { RouteValidator } from "../../../../lib/routeValidator";

const etiquetasAssignBodySchema = z.object({
  etiqueta_ids: z
    .array(z.string().uuid("Cada etiqueta_id debe ser un UUID válido"))
    .min(0, "etiqueta_ids debe ser un array")
    .describe("Array de IDs de etiquetas a asignar al producto"),
});

const etiquetasAssignParamsSchema = z.object({
  id: z.string().uuid("El ID del producto debe ser un UUID válido"),
});

export type EtiquetasAssignBody = z.infer<typeof etiquetasAssignBodySchema>;
export type EtiquetasAssignParams = z.infer<typeof etiquetasAssignParamsSchema>;

export class EtiquetasAssignValidator {
  public validateBody = RouteValidator.create(etiquetasAssignBodySchema);
  public validateParams = RouteValidator.params(etiquetasAssignParamsSchema);
}
