import { z } from "zod";
import { RouteValidator } from "../../../../lib/routeValidator";

const updateTipoParamsSchema = z.object({
  id: z.string().uuid("El ID debe ser un UUID válido"),
});

export type UpdateTipoParams = z.infer<typeof updateTipoParamsSchema>;

export class TipoUpdateParamsValidator {
  public validateParams = RouteValidator.params(updateTipoParamsSchema);
}
