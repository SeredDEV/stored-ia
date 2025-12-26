import { IEtiquetaListService } from "../../../../services/producto/etiqueta/list/etiquetaList.service";
import { EtiquetaListController } from "./etiquetaList.controller";

export interface EtiquetaListEndpointArgs {
  etiquetaService: IEtiquetaListService;
}

export class EtiquetaListEndpoint {
  public controller: EtiquetaListController;

  constructor(args: EtiquetaListEndpointArgs) {
    this.controller = new EtiquetaListController(args.etiquetaService);
  }
}

