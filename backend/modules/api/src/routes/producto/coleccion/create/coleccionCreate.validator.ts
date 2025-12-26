import { z } from "zod";
import { RouteValidator } from "../../../../lib/routeValidator";

const createColeccionSchema = z.object({
  titulo: z.string().min(1, "El título es requerido"),
  slug: z.string().optional(),
  metadatos: z.record(z.any()).optional(),
});

export type CreateColeccionInput = z.infer<typeof createColeccionSchema>;

export class ColeccionCreateValidator {
  public validate = RouteValidator.create(createColeccionSchema);
}

