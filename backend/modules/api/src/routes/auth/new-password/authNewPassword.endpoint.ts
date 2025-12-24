import { AuthNewPasswordController } from "./authNewPassword.controller";
import { AuthNewPasswordValidator } from "./authNewPassword.validator";
import type { IAuthNewPasswordService } from "../../../services/auth/authModel";

export interface AuthNewPasswordEndpointArgs {
  newPasswordService: IAuthNewPasswordService;
}

/**
 * Endpoint de nueva contraseña.
 * Crea controller, validator y endpoint.
 */
export class AuthNewPasswordEndpoint {
  public controller: AuthNewPasswordController;
  public validator: AuthNewPasswordValidator;

  constructor({ newPasswordService }: AuthNewPasswordEndpointArgs) {
    this.controller = new AuthNewPasswordController(newPasswordService);
    this.validator = new AuthNewPasswordValidator();
  }
}

