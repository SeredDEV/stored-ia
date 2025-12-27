import { Router } from "express";
import type { ICategoriaRemoveService } from "../../../../services/producto/categoria/remove-from-producto";
import { CategoriaRemoveEndpoint } from "./categoriaRemove.endpoint";

export class CategoriaRemoveNetwork {
  private endpoint: CategoriaRemoveEndpoint;

  constructor(service: ICategoriaRemoveService) {
    this.endpoint = new CategoriaRemoveEndpoint(service);
  }

  setNetwork(router: Router): void {
    // DELETE /api/productos/:id/categorias/:categoria_id
    router.delete(
      "/:id/categorias/:categoria_id",
      this.endpoint.validator.validateParams,
      this.endpoint.controller.remove
    );
  }
}
