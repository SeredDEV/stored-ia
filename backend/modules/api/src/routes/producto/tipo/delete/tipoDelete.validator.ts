import { z } from "zod";
import { RouteValidator } from "../../../../lib/routeValidator";

const deleteTipoParamsSchema = z.object({
  id: z.string().uuid("El ID debe ser un UUID válido"),
});

export type DeleteTipoParams = z.infer<typeof deleteTipoParamsSchema>;

export class TipoDeleteValidator {
  public validateParams = RouteValidator.params(deleteTipoParamsSchema);
}
