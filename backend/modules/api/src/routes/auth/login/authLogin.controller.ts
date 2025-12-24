import type { Request, Response, NextFunction } from "express";
import type {
  IAuthService,
  AuthLoginModel,
} from "../../../services/auth/authModel";
import type { LoginInput } from "./authLogin.validator";
import { SessionService } from "../../../lib/sessionService";

export interface LoginPayload {
  data: {
    user: {
      id: string;
      email: string;
      role?: string;
    };
  };
}

/**
 * Controller de autenticación.
 * Se encarga de orquestar la lógica: llama al servicio, guarda sesión en Redis y formatea la respuesta HTTP.
 * Similar al patrón del ejemplo: SAuthLoginController.
 */
export class AuthLoginController {
  private sessionService: SessionService;

  constructor(private readonly authService: IAuthService) {
    this.sessionService = new SessionService();
  }

  /**
   * Handler para POST /api/auth/login
   * Asume que el body ya fue validado por el middleware de validación.
   */
  public login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // El body ya viene validado y tipado del middleware
      const { email, password } = req.body as LoginInput;
      const entryApplicationId = (req.body as any).entryApplicationId;

      // El servicio valida contra la DB
      // Si hay error, el servicio lanza una excepción que se captura en el catch
      const loginData = await this.authService.loginWithEmailPassword(
        email,
        password
      );
      const sessionData = this.sessionService.formatSessionData(
        entryApplicationId,
        loginData
      );

      // Guardar sesión en Redis
      await this.sessionService.setSessionData(req, sessionData);

      // Registrar la acción del usuario (logging de auditoría)
      await this.authService.logUserAction(loginData);

      // Responder con los datos del usuario
      res.status(200).json({
        data: {
          user: sessionData.userData.user,
        },
      });
    } catch (err: any) {
      // Si hay un error inesperado, lo pasamos al siguiente middleware de error
      next(err);
    }
  };
}
