import { Router } from "express";
import { TipoUpdateEndpoint } from "./tipoUpdate.endpoint";

export class TipoUpdateNetwork {
  private endpoint: TipoUpdateEndpoint;

  constructor(endpoint: TipoUpdateEndpoint) {
    this.endpoint = endpoint;
  }

  public setNetwork(router: Router): void {
    // PUT /api/tipos/:id
    router.put(
      "/:id",
      this.endpoint.validator.validate,
      this.endpoint.controller.update
    );
  }
}

