import { z } from "zod";
import { RouteValidator } from "../../../../lib/routeValidator";

const updateEtiquetaSchema = z.object({
  valor: z.string().min(1).optional(),
  metadatos: z.record(z.any()).optional(),
});

export type UpdateEtiquetaInput = z.infer<typeof updateEtiquetaSchema>;

export class EtiquetaUpdateValidator {
  public validate = RouteValidator.create(updateEtiquetaSchema);
}

