import { IEtiquetaCreateService } from "../../../../services/producto/etiqueta/create/etiquetaCreate.service";
import { EtiquetaCreateController } from "./etiquetaCreate.controller";
import { EtiquetaCreateValidator } from "./etiquetaCreate.validator";

export interface EtiquetaCreateEndpointArgs {
  etiquetaService: IEtiquetaCreateService;
}

export class EtiquetaCreateEndpoint {
  public validator: EtiquetaCreateValidator;
  public controller: EtiquetaCreateController;

  constructor(args: EtiquetaCreateEndpointArgs) {
    this.validator = new EtiquetaCreateValidator();
    this.controller = new EtiquetaCreateController(args.etiquetaService);
  }
}

