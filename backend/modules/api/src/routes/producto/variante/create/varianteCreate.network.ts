import { Router } from "express";
import { VarianteCreateEndpoint } from "./varianteCreate.endpoint";

export class VarianteCreateNetwork {
  private endpoint: VarianteCreateEndpoint;

  constructor(endpoint: VarianteCreateEndpoint) {
    this.endpoint = endpoint;
  }

  public setNetwork(router: Router): void {
    // POST /api/variantes
    router.post(
      "/",
      this.endpoint.validator.validate,
      this.endpoint.controller.create
    );
  }
}

