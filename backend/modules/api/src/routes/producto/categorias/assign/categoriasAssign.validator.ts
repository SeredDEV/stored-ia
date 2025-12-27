import { z } from "zod";
import { RouteValidator } from "../../../../lib/routeValidator";

const categoriasAssignBodySchema = z.object({
  categoria_ids: z
    .array(z.string().uuid("Cada categoria_id debe ser un UUID válido"))
    .min(0, "categoria_ids debe ser un array")
    .describe("Array de IDs de categorías a asignar al producto"),
});

const categoriasAssignParamsSchema = z.object({
  id: z.string().uuid("El ID del producto debe ser un UUID válido"),
});

export type CategoriasAssignBody = z.infer<typeof categoriasAssignBodySchema>;
export type CategoriasAssignParams = z.infer<
  typeof categoriasAssignParamsSchema
>;

export class CategoriasAssignValidator {
  public validateBody = RouteValidator.create(categoriasAssignBodySchema);
  public validateParams = RouteValidator.params(categoriasAssignParamsSchema);
}
