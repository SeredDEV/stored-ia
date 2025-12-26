import { Router } from "express";
import { EtiquetaGetEndpoint } from "./etiquetaGet.endpoint";

export class EtiquetaGetNetwork {
  private endpoint: EtiquetaGetEndpoint;

  constructor(endpoint: EtiquetaGetEndpoint) {
    this.endpoint = endpoint;
  }

  public setNetwork(router: Router): void {
    // GET /api/etiquetas/:id
    router.get("/:id", this.endpoint.controller.get);
  }
}

