import { Router } from "express";
import { ProductoListEndpoint } from "./productoList.endpoint";

export class ProductoListNetwork {
  constructor(private readonly endpoint: ProductoListEndpoint) {}

  public setNetwork(router: Router): void {
    router.get("/", this.endpoint.controller.list);
  }
}

