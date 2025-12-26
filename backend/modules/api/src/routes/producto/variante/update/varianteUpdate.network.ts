import { Router } from "express";
import { VarianteUpdateEndpoint } from "./varianteUpdate.endpoint";

export class VarianteUpdateNetwork {
  private endpoint: VarianteUpdateEndpoint;

  constructor(endpoint: VarianteUpdateEndpoint) {
    this.endpoint = endpoint;
  }

  public setNetwork(router: Router): void {
    // PUT /api/variantes/:id
    router.put(
      "/:id",
      this.endpoint.validator.validate,
      this.endpoint.controller.update
    );
  }
}

