import express, { Router } from "express";
import { AuthLoginEndpoint } from "./authLogin.endpoint";

/**
 * Network de autenticación.
 * Configura la ruta HTTP con todos sus middlewares (validación, rate limiting, etc.).
 * Similar al patrón del ejemplo: AuthLogin.network.ts
 */
export class AuthLoginNetwork {
  private endpoint: AuthLoginEndpoint;

  constructor(endpoint: AuthLoginEndpoint) {
    this.endpoint = endpoint;
  }

  /**
   * Configura las rutas de autenticación en el router de Express.
   */
  public setNetwork(router: Router): void {
    // POST /api/auth/login
    // Middlewares aplicados en orden:
    // 1. validator.validate - Valida parámetros de entrada (email, password) usando Zod
    // 2. controller.login - Ejecuta la lógica de login
    router.post(
      "/login",
      this.endpoint.validator.validate,
      this.endpoint.controller.login
    );
  }
}
