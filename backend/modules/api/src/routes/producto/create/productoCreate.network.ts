import { Router } from "express";
import { ProductoCreateEndpoint } from "./productoCreate.endpoint";
import { uploadProductImages } from "../../../middleware/uploadMiddleware";

export class ProductoCreateNetwork {
  private endpoint: ProductoCreateEndpoint;

  constructor(endpoint: ProductoCreateEndpoint) {
    this.endpoint = endpoint;
  }

  public setNetwork(router: Router): void {
    // POST /api/productos
    // Usamos uploadProductImages para manejar archivos multipart/form-data
    router.post("/", uploadProductImages, this.endpoint.controller.create);
  }
}
