import { Router } from "express";
import { ProductoCreateEndpoint } from "./productoCreate.endpoint";

export class ProductoCreateNetwork {
  private endpoint: ProductoCreateEndpoint;

  constructor(endpoint: ProductoCreateEndpoint) {
    this.endpoint = endpoint;
  }

  public setNetwork(router: Router): void {
    // POST /api/productos
    // Solo crea el producto con datos básicos
    // Las imágenes se manejan en endpoint separado
    router.post(
      "/",
      this.endpoint.validator.validate,
      this.endpoint.controller.create
    );
  }
}
