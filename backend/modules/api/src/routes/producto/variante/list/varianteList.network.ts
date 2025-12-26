import { Router } from "express";
import { VarianteListEndpoint } from "./varianteList.endpoint";

export class VarianteListNetwork {
  private endpoint: VarianteListEndpoint;

  constructor(endpoint: VarianteListEndpoint) {
    this.endpoint = endpoint;
  }

  public setNetwork(router: Router): void {
    // GET /api/variantes/producto/:producto_id
    router.get("/producto/:producto_id", this.endpoint.controller.listByProducto);
  }
}

