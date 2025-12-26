import { Router } from "express";
import { VarianteGetEndpoint } from "./varianteGet.endpoint";

export class VarianteGetNetwork {
  private endpoint: VarianteGetEndpoint;

  constructor(endpoint: VarianteGetEndpoint) {
    this.endpoint = endpoint;
  }

  public setNetwork(router: Router): void {
    // GET /api/variantes/:id
    router.get("/:id", this.endpoint.controller.get);
  }
}

