import { z } from "zod";
import { RouteValidator } from "../../../../lib/routeValidator";

const updateColeccionParamsSchema = z.object({
  id: z.string().uuid("El ID debe ser un UUID válido"),
});

export type UpdateColeccionParams = z.infer<typeof updateColeccionParamsSchema>;

export class ColeccionUpdateParamsValidator {
  public validateParams = RouteValidator.params(updateColeccionParamsSchema);
}

