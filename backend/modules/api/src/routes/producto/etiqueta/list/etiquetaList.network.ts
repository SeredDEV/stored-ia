import { Router } from "express";
import { EtiquetaListEndpoint } from "./etiquetaList.endpoint";

export class EtiquetaListNetwork {
  private endpoint: EtiquetaListEndpoint;

  constructor(endpoint: EtiquetaListEndpoint) {
    this.endpoint = endpoint;
  }

  public setNetwork(router: Router): void {
    // GET /api/etiquetas
    router.get("/", this.endpoint.controller.list);
  }
}

