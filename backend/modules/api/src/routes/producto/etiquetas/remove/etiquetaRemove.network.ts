import { Router } from "express";
import type { IEtiquetaRemoveService } from "../../../../services/producto/etiqueta/remove-from-producto";
import { EtiquetaRemoveEndpoint } from "./etiquetaRemove.endpoint";

export class EtiquetaRemoveNetwork {
  private endpoint: EtiquetaRemoveEndpoint;

  constructor(service: IEtiquetaRemoveService) {
    this.endpoint = new EtiquetaRemoveEndpoint(service);
  }

  setNetwork(router: Router): void {
    // DELETE /api/productos/:id/etiquetas/:etiqueta_id
    router.delete(
      "/:id/etiquetas/:etiqueta_id",
      this.endpoint.validator.validateParams,
      this.endpoint.controller.remove
    );
  }
}
