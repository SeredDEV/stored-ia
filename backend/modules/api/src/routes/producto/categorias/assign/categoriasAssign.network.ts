import { Router } from "express";
import type { ICategoriaAssignService } from "../../../../services/producto/categoria/assign";
import { CategoriasAssignEndpoint } from "./categoriasAssign.endpoint";

export class CategoriasAssignNetwork {
  private endpoint: CategoriasAssignEndpoint;

  constructor(service: ICategoriaAssignService) {
    this.endpoint = new CategoriasAssignEndpoint(service);
  }

  setNetwork(router: Router): void {
    // POST /api/productos/:id/categorias
    router.post(
      "/:id/categorias",
      this.endpoint.validator.validateParams,
      this.endpoint.validator.validateBody,
      this.endpoint.controller.assign
    );
  }
}
