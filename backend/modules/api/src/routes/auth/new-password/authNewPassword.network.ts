import express, { Router } from "express";
import { AuthNewPasswordEndpoint } from "./authNewPassword.endpoint";

/**
 * Network de nueva contraseña.
 * Configura las rutas HTTP con todos sus middlewares.
 */
export class AuthNewPasswordNetwork {
  private endpoint: AuthNewPasswordEndpoint;

  constructor(endpoint: AuthNewPasswordEndpoint) {
    this.endpoint = endpoint;
  }

  /**
   * Configura las rutas de nueva contraseña en el router de Express.
   */
  public setNetwork(router: Router): void {
    // POST /api/auth/new-password
    // Establece nueva contraseña con token y nueva contraseña
    router.post(
      "/new-password",
      this.endpoint.validator.validate,
      this.endpoint.controller.setNewPassword
    );
  }
}

