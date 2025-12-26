import { Router } from "express";
import { TipoListEndpoint } from "./tipoList.endpoint";

export class TipoListNetwork {
  private endpoint: TipoListEndpoint;

  constructor(endpoint: TipoListEndpoint) {
    this.endpoint = endpoint;
  }

  public setNetwork(router: Router): void {
    // GET /api/tipos
    router.get("/", this.endpoint.controller.list);
  }
}

