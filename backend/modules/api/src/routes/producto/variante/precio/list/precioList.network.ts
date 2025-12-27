import { Router } from "express";
import { PrecioListEndpoint } from "./precioList.endpoint";

export class PrecioListNetwork {
  private endpoint: PrecioListEndpoint;

  constructor(endpoint: PrecioListEndpoint) {
    this.endpoint = endpoint;
  }

  public setNetwork(router: Router): void {
    // GET /api/variantes/:variante_id/precios
    router.get("/:variante_id/precios", this.endpoint.controller.list);
  }
}
