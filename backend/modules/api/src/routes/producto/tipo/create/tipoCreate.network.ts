import { Router } from "express";
import { TipoCreateEndpoint } from "./tipoCreate.endpoint";

export class TipoCreateNetwork {
  private endpoint: TipoCreateEndpoint;

  constructor(endpoint: TipoCreateEndpoint) {
    this.endpoint = endpoint;
  }

  public setNetwork(router: Router): void {
    // POST /api/tipos
    router.post(
      "/",
      this.endpoint.validator.validate,
      this.endpoint.controller.create
    );
  }
}

