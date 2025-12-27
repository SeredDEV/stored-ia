import { Router } from "express";
import type { IEtiquetaListByProductoService } from "../../../../services/producto/etiqueta/list-by-producto";
import { EtiquetasListEndpoint } from "./etiquetasList.endpoint";

export class EtiquetasListNetwork {
  private endpoint: EtiquetasListEndpoint;

  constructor(service: IEtiquetaListByProductoService) {
    this.endpoint = new EtiquetasListEndpoint(service);
  }

  setNetwork(router: Router): void {
    // GET /api/productos/:id/etiquetas
    router.get(
      "/:id/etiquetas",
      this.endpoint.validator.validateParams,
      this.endpoint.controller.list
    );
  }
}
