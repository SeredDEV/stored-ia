import { Router } from "express";
import { VarianteDeleteEndpoint } from "./varianteDelete.endpoint";

export class VarianteDeleteNetwork {
  private endpoint: VarianteDeleteEndpoint;

  constructor(endpoint: VarianteDeleteEndpoint) {
    this.endpoint = endpoint;
  }

  public setNetwork(router: Router): void {
    // DELETE /api/variantes/:id
    router.delete("/:id", this.endpoint.controller.delete);
  }
}

