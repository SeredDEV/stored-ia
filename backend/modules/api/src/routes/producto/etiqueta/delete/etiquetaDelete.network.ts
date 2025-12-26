import { Router } from "express";
import { EtiquetaDeleteEndpoint } from "./etiquetaDelete.endpoint";

export class EtiquetaDeleteNetwork {
  private endpoint: EtiquetaDeleteEndpoint;

  constructor(endpoint: EtiquetaDeleteEndpoint) {
    this.endpoint = endpoint;
  }

  public setNetwork(router: Router): void {
    // DELETE /api/etiquetas/:id
    router.delete("/:id", this.endpoint.controller.delete);
  }
}

