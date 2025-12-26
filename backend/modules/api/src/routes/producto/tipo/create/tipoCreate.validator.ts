import { z } from "zod";
import { RouteValidator } from "../../../../lib/routeValidator";

const createTipoSchema = z.object({
  valor: z.string().min(1, "El valor es requerido"),
  metadatos: z.record(z.any()).optional(),
});

export type CreateTipoInput = z.infer<typeof createTipoSchema>;

export class TipoCreateValidator {
  public validate = RouteValidator.create(createTipoSchema);
}

