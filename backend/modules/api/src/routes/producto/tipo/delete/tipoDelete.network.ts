import { Router } from "express";
import { TipoDeleteEndpoint } from "./tipoDelete.endpoint";

export class TipoDeleteNetwork {
  private endpoint: TipoDeleteEndpoint;

  constructor(endpoint: TipoDeleteEndpoint) {
    this.endpoint = endpoint;
  }

  public setNetwork(router: Router): void {
    // DELETE /api/tipos/:id
    router.delete("/:id", this.endpoint.controller.delete);
  }
}

