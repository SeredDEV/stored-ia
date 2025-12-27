import type { IEtiquetaRemoveService } from "../../../../services/producto/etiqueta/remove-from-producto";
import { EtiquetaRemoveController } from "./etiquetaRemove.controller";
import { EtiquetaRemoveValidator } from "./etiquetaRemove.validator";

export class EtiquetaRemoveEndpoint {
  public validator: EtiquetaRemoveValidator;
  public controller: EtiquetaRemoveController;

  constructor(service: IEtiquetaRemoveService) {
    this.validator = new EtiquetaRemoveValidator();
    this.controller = new EtiquetaRemoveController(service);
  }
}
