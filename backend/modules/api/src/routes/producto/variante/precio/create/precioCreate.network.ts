import { Router } from "express";
import { PrecioCreateEndpoint } from "./precioCreate.endpoint";

export class PrecioCreateNetwork {
  private endpoint: PrecioCreateEndpoint;

  constructor(endpoint: PrecioCreateEndpoint) {
    this.endpoint = endpoint;
  }

  public setNetwork(router: Router): void {
    // POST /api/variantes/:variante_id/precios
    router.post(
      "/:variante_id/precios",
      this.endpoint.validator.validate,
      this.endpoint.controller.create
    );
  }
}
