import { Router } from "express";
import { ProductoUpdateEndpoint } from "./productoUpdate.endpoint";

export class ProductoUpdateNetwork {
  constructor(private readonly endpoint: ProductoUpdateEndpoint) {}

  public setNetwork(router: Router): void {
    router.put(
      "/:id",
      this.endpoint.validator.validateParams,
      this.endpoint.validator.validateBody,
      this.endpoint.controller.update
    );
  }
}

