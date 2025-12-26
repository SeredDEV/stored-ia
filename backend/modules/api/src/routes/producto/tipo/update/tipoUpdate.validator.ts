import { z } from "zod";
import { RouteValidator } from "../../../../lib/routeValidator";

const updateTipoSchema = z.object({
  valor: z.string().min(1).optional(),
  metadatos: z.record(z.any()).optional(),
});

export type UpdateTipoInput = z.infer<typeof updateTipoSchema>;

export class TipoUpdateValidator {
  public validate = RouteValidator.create(updateTipoSchema);
}

