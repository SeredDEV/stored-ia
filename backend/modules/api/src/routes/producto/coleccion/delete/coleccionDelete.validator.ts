import { z } from "zod";
import { RouteValidator } from "../../../../lib/routeValidator";

const deleteColeccionParamsSchema = z.object({
  id: z.string().uuid("El ID debe ser un UUID válido"),
});

export type DeleteColeccionParams = z.infer<typeof deleteColeccionParamsSchema>;

export class ColeccionDeleteValidator {
  public validateParams = RouteValidator.params(deleteColeccionParamsSchema);
}
