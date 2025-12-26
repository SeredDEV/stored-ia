import { IEtiquetaUpdateService } from "../../../../services/producto/etiqueta/update/etiquetaUpdate.service";
import { EtiquetaUpdateController } from "./etiquetaUpdate.controller";
import { EtiquetaUpdateValidator } from "./etiquetaUpdate.validator";

export interface EtiquetaUpdateEndpointArgs {
  etiquetaService: IEtiquetaUpdateService;
}

export class EtiquetaUpdateEndpoint {
  public validator: EtiquetaUpdateValidator;
  public controller: EtiquetaUpdateController;

  constructor(args: EtiquetaUpdateEndpointArgs) {
    this.validator = new EtiquetaUpdateValidator();
    this.controller = new EtiquetaUpdateController(args.etiquetaService);
  }
}

