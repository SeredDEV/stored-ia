import { z } from "zod";
import { RouteValidator } from "../../../../lib/routeValidator";

const updateCategoriaSchema = z.object({
  nombre: z.string().min(1).optional(),
  descripcion: z.string().optional(),
  slug: z.string().optional(),
  categoria_padre_id: z.string().uuid().optional(),
  rango: z.number().optional(),
  activa: z.boolean().optional(),
  interna: z.boolean().optional(),
  metadatos: z.record(z.any()).optional(),
});

export type UpdateCategoriaInput = z.infer<typeof updateCategoriaSchema>;

export class CategoriaUpdateValidator {
  public validate = RouteValidator.create(updateCategoriaSchema);
}

