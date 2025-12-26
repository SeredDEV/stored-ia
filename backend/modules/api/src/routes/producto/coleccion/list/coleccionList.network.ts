import { Router } from "express";
import { ColeccionListEndpoint } from "./coleccionList.endpoint";

export class ColeccionListNetwork {
  private endpoint: ColeccionListEndpoint;

  constructor(endpoint: ColeccionListEndpoint) {
    this.endpoint = endpoint;
  }

  public setNetwork(router: Router): void {
    // GET /api/colecciones
    router.get("/", this.endpoint.controller.list);
  }
}

