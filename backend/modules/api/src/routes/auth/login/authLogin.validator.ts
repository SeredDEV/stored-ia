import { z } from "zod";
import { RouteValidator } from "../../../lib/routeValidator";

/**
 * Schema de validación para login.
 * Define qué parámetros de entrada se validan y cómo.
 */
const loginSchema = z.object({
  email: z
    .string({
      required_error: "El email es requerido",
      invalid_type_error: "El email debe ser un texto",
    })
    .email("El formato del email no es válido")
    .min(1, "El email no puede estar vacío"),
  password: z
    .string({
      required_error: "La contraseña es requerida",
      invalid_type_error: "La contraseña debe ser un texto",
    })
    .min(1, "La contraseña no puede estar vacía"),
});

/**
 * Tipo inferido del schema de login.
 * Representa los datos de entrada validados.
 */
export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Validator de autenticación.
 * Solo define los parámetros de entrada a validar.
 * La validación real la hace RouteValidator.
 */
export class AuthLoginValidator {
  /**
   * Middleware Express para validar el body de login.
   * Usa RouteValidator para ejecutar la validación con el schema definido.
   */
  public validate = RouteValidator.create(loginSchema);
}
