import { Router } from "express";
import { EtiquetaUpdateEndpoint } from "./etiquetaUpdate.endpoint";

export class EtiquetaUpdateNetwork {
  private endpoint: EtiquetaUpdateEndpoint;

  constructor(endpoint: EtiquetaUpdateEndpoint) {
    this.endpoint = endpoint;
  }

  public setNetwork(router: Router): void {
    // PUT /api/etiquetas/:id
    router.put(
      "/:id",
      this.endpoint.validator.validate,
      this.endpoint.controller.update
    );
  }
}

