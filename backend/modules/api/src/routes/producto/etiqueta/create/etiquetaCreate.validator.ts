import { z } from "zod";
import { RouteValidator } from "../../../../lib/routeValidator";

const createEtiquetaSchema = z.object({
  valor: z.string().min(1, "El valor es requerido"),
  metadatos: z.record(z.any()).optional(),
});

export type CreateEtiquetaInput = z.infer<typeof createEtiquetaSchema>;

export class EtiquetaCreateValidator {
  public validate = RouteValidator.create(createEtiquetaSchema);
}

