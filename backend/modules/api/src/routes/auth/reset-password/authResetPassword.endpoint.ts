import { AuthResetPasswordController } from "./authResetPassword.controller";
import { AuthResetPasswordValidator } from "./authResetPassword.validator";
import type { IAuthResetPasswordService } from "../../../services/auth/authModel";

export interface AuthResetPasswordEndpointArgs {
  resetPasswordService: IAuthResetPasswordService;
}

/**
 * Endpoint de reset de contraseña.
 * Crea controller, validator y endpoint.
 */
export class AuthResetPasswordEndpoint {
  public controller: AuthResetPasswordController;
  public validator: AuthResetPasswordValidator;

  constructor({ resetPasswordService }: AuthResetPasswordEndpointArgs) {
    this.controller = new AuthResetPasswordController(resetPasswordService);
    this.validator = new AuthResetPasswordValidator();
  }
}
