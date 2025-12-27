import type { IEtiquetaAssignService } from "../../../../services/producto/etiqueta/assign";
import { EtiquetasAssignController } from "./etiquetasAssign.controller";
import { EtiquetasAssignValidator } from "./etiquetasAssign.validator";

export class EtiquetasAssignEndpoint {
  public validator: EtiquetasAssignValidator;
  public controller: EtiquetasAssignController;

  constructor(service: IEtiquetaAssignService) {
    this.validator = new EtiquetasAssignValidator();
    this.controller = new EtiquetasAssignController(service);
  }
}
