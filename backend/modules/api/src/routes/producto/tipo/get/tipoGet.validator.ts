import { z } from "zod";
import { RouteValidator } from "../../../../lib/routeValidator";

const getTipoParamsSchema = z.object({
  id: z.string().uuid("El ID debe ser un UUID válido"),
});

export type GetTipoParams = z.infer<typeof getTipoParamsSchema>;

export class TipoGetValidator {
  public validateParams = RouteValidator.params(getTipoParamsSchema);
}
