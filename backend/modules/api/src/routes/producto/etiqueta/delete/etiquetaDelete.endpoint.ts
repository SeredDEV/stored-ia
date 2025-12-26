import { IEtiquetaDeleteService } from "../../../../services/producto/etiqueta/delete/etiquetaDelete.service";
import { EtiquetaDeleteController } from "./etiquetaDelete.controller";

export interface EtiquetaDeleteEndpointArgs {
  etiquetaService: IEtiquetaDeleteService;
}

export class EtiquetaDeleteEndpoint {
  public controller: EtiquetaDeleteController;

  constructor(args: EtiquetaDeleteEndpointArgs) {
    this.controller = new EtiquetaDeleteController(args.etiquetaService);
  }
}

