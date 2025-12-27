import { Router } from "express";
import type { ICategoriaListByProductoService } from "../../../../services/producto/categoria/list-by-producto";
import { CategoriasListEndpoint } from "./categoriasList.endpoint";

export class CategoriasListNetwork {
  private endpoint: CategoriasListEndpoint;

  constructor(service: ICategoriaListByProductoService) {
    this.endpoint = new CategoriasListEndpoint(service);
  }

  setNetwork(router: Router): void {
    // GET /api/productos/:id/categorias
    router.get(
      "/:id/categorias",
      this.endpoint.validator.validateParams,
      this.endpoint.controller.list
    );
  }
}
