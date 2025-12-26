import { Router } from "express";
import { ProductoDeleteEndpoint } from "./productoDelete.endpoint";

export class ProductoDeleteNetwork {
  constructor(private readonly endpoint: ProductoDeleteEndpoint) {}

  public setNetwork(router: Router): void {
    router.delete(
      "/:id",
      this.endpoint.validator.validateParams,
      this.endpoint.controller.delete
    );
  }
}

