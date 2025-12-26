import { z } from "zod";
import { RouteValidator } from "../../../../lib/routeValidator";

const createCategoriaSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido"),
  descripcion: z.string().optional(),
  slug: z.string().optional(),
  categoria_padre_id: z.string().uuid().optional(),
  rango: z.number().optional(),
  activa: z.boolean().optional(),
  interna: z.boolean().optional(),
  metadatos: z.record(z.any()).optional(),
});

export type CreateCategoriaInput = z.infer<typeof createCategoriaSchema>;

export class CategoriaCreateValidator {
  public validate = RouteValidator.create(createCategoriaSchema);
}

