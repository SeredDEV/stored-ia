import { z } from "zod";
import { RouteValidator } from "../../../lib/routeValidator";

/**
 * Schema de validación para solicitar reset de contraseña.
 */
const requestResetSchema = z.object({
  email: z
    .string({
      required_error: "El email es requerido",
      invalid_type_error: "El email debe ser un texto",
    })
    .email("El formato del email no es válido")
    .min(1, "El email no puede estar vacío"),
});

/**
 * Schema de validación para confirmar reset de contraseña.
 */
const confirmResetSchema = z.object({
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
});

/**
 * Tipos inferidos de los schemas.
 */
export type RequestResetInput = z.infer<typeof requestResetSchema>;
export type ConfirmResetInput = z.infer<typeof confirmResetSchema>;

/**
 * Validator de reset de contraseña.
 */
export class AuthResetPasswordValidator {
  /**
   * Middleware Express para validar el body de solicitud de reset.
   */
  public validateRequest = RouteValidator.create(requestResetSchema);

  /**
   * Middleware Express para validar el body de confirmación de reset.
   */
  public validateConfirm = RouteValidator.create(confirmResetSchema);
}
