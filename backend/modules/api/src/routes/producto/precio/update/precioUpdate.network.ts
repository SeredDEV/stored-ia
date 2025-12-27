import { Router } from "express";
import { PrecioUpdateEndpoint } from "./precioUpdate.endpoint";

export class PrecioUpdateNetwork {
  private endpoint: PrecioUpdateEndpoint;

  constructor(endpoint: PrecioUpdateEndpoint) {
    this.endpoint = endpoint;
  }

  public setNetwork(router: Router): void {
    // PUT /api/precios/:id
    router.put(
      "/:id",
      this.endpoint.validator.validate,
      this.endpoint.controller.update
    );
  }
}
