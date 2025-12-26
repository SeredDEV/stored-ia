import { Router } from "express";
import { ColeccionGetEndpoint } from "./coleccionGet.endpoint";

export class ColeccionGetNetwork {
  private endpoint: ColeccionGetEndpoint;

  constructor(endpoint: ColeccionGetEndpoint) {
    this.endpoint = endpoint;
  }

  public setNetwork(router: Router): void {
    // GET /api/colecciones/:id
    router.get(
      "/:id",
      this.endpoint.validator.validateParams,
      this.endpoint.controller.get
    );
  }
}

