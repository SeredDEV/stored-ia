import { Router } from "express";
import { ColeccionUpdateEndpoint } from "./coleccionUpdate.endpoint";

export class ColeccionUpdateNetwork {
  private endpoint: ColeccionUpdateEndpoint;

  constructor(endpoint: ColeccionUpdateEndpoint) {
    this.endpoint = endpoint;
  }

  public setNetwork(router: Router): void {
    // PUT /api/colecciones/:id
    router.put(
      "/:id",
      this.endpoint.paramsValidator.validateParams,
      this.endpoint.validator.validate,
      this.endpoint.controller.update
    );
  }
}

