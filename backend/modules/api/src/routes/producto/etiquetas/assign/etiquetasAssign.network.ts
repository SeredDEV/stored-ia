import { Router } from "express";
import type { IEtiquetaAssignService } from "../../../../services/producto/etiqueta/assign";
import { EtiquetasAssignEndpoint } from "./etiquetasAssign.endpoint";

export class EtiquetasAssignNetwork {
  private endpoint: EtiquetasAssignEndpoint;

  constructor(service: IEtiquetaAssignService) {
    this.endpoint = new EtiquetasAssignEndpoint(service);
  }

  setNetwork(router: Router): void {
    // POST /api/productos/:id/etiquetas
    router.post(
      "/:id/etiquetas",
      this.endpoint.validator.validateParams,
      this.endpoint.validator.validateBody,
      this.endpoint.controller.assign
    );
  }
}
