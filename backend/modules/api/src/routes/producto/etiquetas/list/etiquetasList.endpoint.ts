import type { IEtiquetaListByProductoService } from "../../../../services/producto/etiqueta/list-by-producto";
import { EtiquetasListController } from "./etiquetasList.controller";
import { EtiquetasListValidator } from "./etiquetasList.validator";

export class EtiquetasListEndpoint {
  public validator: EtiquetasListValidator;
  public controller: EtiquetasListController;

  constructor(service: IEtiquetaListByProductoService) {
    this.validator = new EtiquetasListValidator();
    this.controller = new EtiquetasListController(service);
  }
}
