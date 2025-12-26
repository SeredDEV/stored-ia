import { Router } from "express";
import { ProductoGetEndpoint } from "./productoGet.endpoint";

export class ProductoGetNetwork {
  constructor(private readonly endpoint: ProductoGetEndpoint) {}

  public setNetwork(router: Router): void {
    router.get(
      "/:id",
      this.endpoint.validator.validateParams,
      this.endpoint.controller.get
    );
  }
}

