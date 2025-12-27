import { z } from "zod";
import { RouteValidator } from "../../../../../lib/routeValidator";

const createPrecioSchema = z.object({
  monto: z.number().positive("El monto debe ser mayor a 0"),
  codigo_moneda: z
    .string()
    .length(3, "El código de moneda debe tener 3 caracteres"),
  cantidad_minima: z.number().positive().optional(),
  cantidad_maxima: z.number().positive().optional(),
});

export type CreatePrecioInput = z.infer<typeof createPrecioSchema>;

export class PrecioCreateValidator {
  public validate = RouteValidator.create(createPrecioSchema);
}
