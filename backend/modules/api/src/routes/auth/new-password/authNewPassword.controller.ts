import type { Request, Response, NextFunction } from "express";
import type { IAuthNewPasswordService } from "../../../services/auth/authModel";
import type { NewPasswordInput } from "./authNewPassword.validator";

/**
 * Controller de nueva contraseña.
 * Se encarga de orquestar la lógica de establecer nueva contraseña después del reset.
 */
export class AuthNewPasswordController {
  constructor(
    private readonly newPasswordService: IAuthNewPasswordService
  ) {}

  /**
   * Handler para POST /api/auth/new-password
   * Establece una nueva contraseña usando el token de recuperación.
   */
  public setNewPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { token, password, refreshToken } = req.body as NewPasswordInput;

      // El servicio valida el token y actualiza la contraseña
      await this.newPasswordService.setNewPassword(token, password, refreshToken);

      // Responder con éxito
      res.status(200).json({
        message: "Contraseña restablecida exitosamente",
      });
    } catch (err: any) {
      next(err);
    }
  };
}

