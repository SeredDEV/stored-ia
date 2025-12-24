import type { Request, Response, NextFunction } from "express";
import type { IAuthResetPasswordService } from "../../../services/auth/authModel";
import type {
  RequestResetInput,
  ConfirmResetInput,
} from "./authResetPassword.validator";

/**
 * Controller de reset de contraseña.
 * Se encarga de orquestar la lógica de reset de contraseña.
 */
export class AuthResetPasswordController {
  constructor(
    private readonly resetPasswordService: IAuthResetPasswordService
  ) {}

  /**
   * Handler para POST /api/auth/reset-password
   * Solicita un reset de contraseña enviando un email con el token.
   */
  public requestReset = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email } = req.body as RequestResetInput;

      // El servicio envía el email con el token de reset
      await this.resetPasswordService.requestPasswordReset(email);

      // Responder con éxito (no exponer si el email existe o no por seguridad)
      res.status(200).json({
        message:
          "Si el email existe, se ha enviado un enlace para restablecer la contraseña",
      });
    } catch (err: any) {
      next(err);
    }
  };

  /**
   * Handler para POST /api/auth/reset-password/confirm
   * Confirma el reset de contraseña con el token y la nueva contraseña.
   */
  public confirmReset = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { token, password } = req.body as ConfirmResetInput;

      // El servicio valida el token y actualiza la contraseña
      await this.resetPasswordService.confirmPasswordReset(token, password);

      // Responder con éxito
      res.status(200).json({
        message: "Contraseña restablecida exitosamente",
      });
    } catch (err: any) {
      next(err);
    }
  };
}
