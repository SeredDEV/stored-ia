import { IEtiquetaGetService } from "../../../../services/producto/etiqueta/get/etiquetaGet.service";
import { EtiquetaGetController } from "./etiquetaGet.controller";

export interface EtiquetaGetEndpointArgs {
  etiquetaService: IEtiquetaGetService;
}

export class EtiquetaGetEndpoint {
  public controller: EtiquetaGetController;

  constructor(args: EtiquetaGetEndpointArgs) {
    this.controller = new EtiquetaGetController(args.etiquetaService);
  }
}

