import { z } from "zod";
import { RouteValidator } from "../../../../lib/routeValidator";

const updateColeccionSchema = z.object({
  titulo: z.string().min(1).optional(),
  slug: z.string().optional(),
  metadatos: z.record(z.any()).optional(),
});

export type UpdateColeccionInput = z.infer<typeof updateColeccionSchema>;

export class ColeccionUpdateValidator {
  public validate = RouteValidator.create(updateColeccionSchema);
}

