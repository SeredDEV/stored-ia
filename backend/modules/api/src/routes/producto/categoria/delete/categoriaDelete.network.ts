import { Router } from "express";
import { CategoriaDeleteEndpoint } from "./categoriaDelete.endpoint";

export class CategoriaDeleteNetwork {
  private endpoint: CategoriaDeleteEndpoint;

  constructor(endpoint: CategoriaDeleteEndpoint) {
    this.endpoint = endpoint;
  }

  public setNetwork(router: Router): void {
    // DELETE /api/categorias/:id
    router.delete(
      "/:id",
      this.endpoint.validator.validateParams,
      this.endpoint.controller.delete
    );
  }
}

