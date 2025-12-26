import { Router } from "express";
import { TipoGetEndpoint } from "./tipoGet.endpoint";

export class TipoGetNetwork {
  private endpoint: TipoGetEndpoint;

  constructor(endpoint: TipoGetEndpoint) {
    this.endpoint = endpoint;
  }

  public setNetwork(router: Router): void {
    // GET /api/tipos/:id
    router.get("/:id", this.endpoint.controller.get);
  }
}

