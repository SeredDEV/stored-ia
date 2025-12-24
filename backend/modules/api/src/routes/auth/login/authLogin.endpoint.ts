import { AuthLoginController } from "./authLogin.controller";
import { AuthLoginValidator } from "./authLogin.validator";
import type { IAuthService } from "../../../services/auth/authModel";

export interface AuthLoginEndpointArgs {
  authService: IAuthService;
}

/**
 * Endpoint de autenticación.
 * Crea controller, validator y endpoint.
 * Similar al patrón del ejemplo: AuthLogin.endpoint.ts
 */
export class AuthLoginEndpoint {
  public controller: AuthLoginController;
  public validator: AuthLoginValidator;

  constructor({ authService }: AuthLoginEndpointArgs) {
    this.controller = new AuthLoginController(authService);
    this.validator = new AuthLoginValidator();
  }
}
