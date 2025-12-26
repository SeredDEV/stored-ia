import { Router } from "express";
import { CategoriaCreateEndpoint } from "./categoriaCreate.endpoint";

export class CategoriaCreateNetwork {
  private endpoint: CategoriaCreateEndpoint;

  constructor(endpoint: CategoriaCreateEndpoint) {
    this.endpoint = endpoint;
  }

  public setNetwork(router: Router): void {
    // POST /api/categorias
    router.post(
      "/",
      this.endpoint.validator.validate,
      this.endpoint.controller.create
    );
  }
}
