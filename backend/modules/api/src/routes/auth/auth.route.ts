import { Router, type Express } from "express";
import { AuthLoginEndpoint } from "./login/authLogin.endpoint";
import { AuthLoginNetwork } from "./login/authLogin.network";
import { AuthResetPasswordEndpoint } from "./reset-password/authResetPassword.endpoint";
import { AuthResetPasswordNetwork } from "./reset-password/authResetPassword.network";
import type { IAuthService } from "../../services/auth/authModel";
import type { IAuthResetPasswordService } from "../../services/auth/authModel";

/**
 * Router de autenticación.
 * Registra todas las rutas de autenticación en el servidor.
 * Similar al patrón del ejemplo: mAuth.route.ts
 */
export class AuthRoute {
  public static register(
    server: Express,
    authService: IAuthService,
    resetPasswordService: IAuthResetPasswordService
  ): void {
    const router = Router();

    // Login routes
    const authLoginEndpoint = new AuthLoginEndpoint({ authService });
    const authLoginNetwork = new AuthLoginNetwork(authLoginEndpoint);
    authLoginNetwork.setNetwork(router);

    // Reset password routes
    const authResetPasswordEndpoint = new AuthResetPasswordEndpoint({
      resetPasswordService,
    });
    const authResetPasswordNetwork = new AuthResetPasswordNetwork(
      authResetPasswordEndpoint
    );
    authResetPasswordNetwork.setNetwork(router);

    // Registrar el router en el servidor con el path /auth
    server.use("/api/auth", router);
  }
}
