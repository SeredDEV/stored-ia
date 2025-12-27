import { z } from "zod";
import { RouteValidator } from "../../../../lib/routeValidator";

const updatePrecioSchema = z.object({
  monto: z.number().positive("El monto debe ser mayor a 0").optional(),
  codigo_moneda: z
    .string()
    .length(3, "El código de moneda debe tener 3 caracteres")
    .optional(),
  cantidad_minima: z.number().positive().optional(),
  cantidad_maxima: z.number().positive().nullable().optional(),
});

export type UpdatePrecioInput = z.infer<typeof updatePrecioSchema>;

export class PrecioUpdateValidator {
  public validate = RouteValidator.create(updatePrecioSchema);
}
