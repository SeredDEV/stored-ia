import { z } from "zod";
import { RouteValidator } from "../../../lib/routeValidator";

/**
 * Schema de validación para establecer nueva contraseña.
 */
const newPasswordSchema = z.object({
  token: z
    .string({
      required_error: "El token es requerido",
      invalid_type_error: "El token debe ser un texto",
    })
    .min(1, "El token no puede estar vacío"),
  password: z
    .string({
      required_error: "La contraseña es requerida",
      invalid_type_error: "La contraseña debe ser un texto",
    })
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
  refreshToken: z
    .string({
      invalid_type_error: "El refresh token debe ser un texto",
    })
    .optional(),
});

/**
 * Tipos inferidos de los schemas.
 */
export type NewPasswordInput = z.infer<typeof newPasswordSchema>;

/**
 * Validator de nueva contraseña.
 */
export class AuthNewPasswordValidator {
  /**
   * Middleware Express para validar el body de nueva contraseña.
   */
  public validate = RouteValidator.create(newPasswordSchema);
}
