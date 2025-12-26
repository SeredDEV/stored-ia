import { Router } from "express";
import { CategoriaGetEndpoint } from "./categoriaGet.endpoint";

export class CategoriaGetNetwork {
  private endpoint: CategoriaGetEndpoint;

  constructor(endpoint: CategoriaGetEndpoint) {
    this.endpoint = endpoint;
  }

  public setNetwork(router: Router): void {
    // GET /api/categorias/:id
    router.get(
      "/:id",
      this.endpoint.validator.validateParams,
      this.endpoint.controller.get
    );
  }
}
