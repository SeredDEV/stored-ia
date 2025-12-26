import { Router } from "express";
import { ColeccionDeleteEndpoint } from "./coleccionDelete.endpoint";

export class ColeccionDeleteNetwork {
  private endpoint: ColeccionDeleteEndpoint;

  constructor(endpoint: ColeccionDeleteEndpoint) {
    this.endpoint = endpoint;
  }

  public setNetwork(router: Router): void {
    // DELETE /api/colecciones/:id
    router.delete(
      "/:id",
      this.endpoint.validator.validateParams,
      this.endpoint.controller.delete
    );
  }
}

