import { z } from "zod";
import { RouteValidator } from "../../../lib/routeValidator";

const paramsSchema = z.object({
  id: z.string().uuid("ID de producto inválido"),
});

export class ProductoDeleteValidator {
  public static create() {
    return {
      validateParams: RouteValidator.params(paramsSchema),
    };
  }
}

