import express, { Router } from "express";
import { AuthResetPasswordEndpoint } from "./authResetPassword.endpoint";

/**
 * Network de reset de contraseña.
 * Configura las rutas HTTP con todos sus middlewares.
 */
export class AuthResetPasswordNetwork {
  private endpoint: AuthResetPasswordEndpoint;

  constructor(endpoint: AuthResetPasswordEndpoint) {
    this.endpoint = endpoint;
  }

  /**
   * Configura las rutas de reset de contraseña en el router de Express.
   */
  public setNetwork(router: Router): void {
    // POST /api/auth/reset-password
    // Solicita un reset de contraseña (envía email)
    router.post(
      "/reset-password",
      this.endpoint.validator.validateRequest,
      this.endpoint.controller.requestReset
    );

    // POST /api/auth/reset-password/confirm
    // Confirma el reset con token y nueva contraseña
    router.post(
      "/reset-password/confirm",
      this.endpoint.validator.validateConfirm,
      this.endpoint.controller.confirmReset
    );
  }
}
