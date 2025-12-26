import { Router } from "express";
import { CategoriaListEndpoint } from "./categoriaList.endpoint";

export class CategoriaListNetwork {
  private endpoint: CategoriaListEndpoint;

  constructor(endpoint: CategoriaListEndpoint) {
    this.endpoint = endpoint;
  }

  public setNetwork(router: Router): void {
    // GET /api/categorias
    router.get("/", this.endpoint.controller.list);
  }
}
