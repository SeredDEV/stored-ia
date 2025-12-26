import { z } from "zod";
import { RouteValidator } from "../../../../lib/routeValidator";

const getColeccionParamsSchema = z.object({
  id: z.string().uuid("El ID debe ser un UUID válido"),
});

export type GetColeccionParams = z.infer<typeof getColeccionParamsSchema>;

export class ColeccionGetValidator {
  public validateParams = RouteValidator.params(getColeccionParamsSchema);
}
