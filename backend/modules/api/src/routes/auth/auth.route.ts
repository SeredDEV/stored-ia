import { Router, type Express } from "express";
import { AuthLoginEndpoint } from "./login/authLogin.endpoint";
import { AuthLoginNetwork } from "./login/authLogin.network";
import type { IAuthService } from "../../services/auth/authModel";

/**
 * Router de autenticación.
 * Registra todas las rutas de autenticación en el servidor.
 * Similar al patrón del ejemplo: mAuth.route.ts
 */
export class AuthRoute {
  public static register(server: Express, authService: IAuthService): void {
    const router = Router();
    const authEndpoint = new AuthLoginEndpoint({ authService });
    const authNetwork = new AuthLoginNetwork(authEndpoint);

    authNetwork.setNetwork(router);

    // Registrar el router en el servidor con el path /auth
    server.use("/api/auth", router);
  }
}
