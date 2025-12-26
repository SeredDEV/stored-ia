import { Router } from "express";
import { EtiquetaCreateEndpoint } from "./etiquetaCreate.endpoint";

export class EtiquetaCreateNetwork {
  private endpoint: EtiquetaCreateEndpoint;

  constructor(endpoint: EtiquetaCreateEndpoint) {
    this.endpoint = endpoint;
  }

  public setNetwork(router: Router): void {
    // POST /api/etiquetas
    router.post(
      "/",
      this.endpoint.validator.validate,
      this.endpoint.controller.create
    );
  }
}

