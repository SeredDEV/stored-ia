import { Router } from "express";
import { CategoriaUpdateEndpoint } from "./categoriaUpdate.endpoint";

export class CategoriaUpdateNetwork {
  private endpoint: CategoriaUpdateEndpoint;

  constructor(endpoint: CategoriaUpdateEndpoint) {
    this.endpoint = endpoint;
  }

  public setNetwork(router: Router): void {
    // PUT /api/categorias/:id
    router.put(
      "/:id",
      this.endpoint.paramsValidator.validateParams,
      this.endpoint.validator.validate,
      this.endpoint.controller.update
    );
  }
}
