import { Router } from "express";
import { ColeccionCreateEndpoint } from "./coleccionCreate.endpoint";

export class ColeccionCreateNetwork {
  private endpoint: ColeccionCreateEndpoint;

  constructor(endpoint: ColeccionCreateEndpoint) {
    this.endpoint = endpoint;
  }

  public setNetwork(router: Router): void {
    // POST /api/colecciones
    router.post(
      "/",
      this.endpoint.validator.validate,
      this.endpoint.controller.create
    );
  }
}

