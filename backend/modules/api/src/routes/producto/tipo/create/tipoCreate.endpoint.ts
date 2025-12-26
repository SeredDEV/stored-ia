import { ITipoCreateService } from "../../../../services/producto/tipo/create/tipoCreate.service";
import { TipoCreateController } from "./tipoCreate.controller";
import { TipoCreateValidator } from "./tipoCreate.validator";

export interface TipoCreateEndpointArgs {
  tipoService: ITipoCreateService;
}

export class TipoCreateEndpoint {
  public validator: TipoCreateValidator;
  public controller: TipoCreateController;

  constructor(args: TipoCreateEndpointArgs) {
    this.validator = new TipoCreateValidator();
    this.controller = new TipoCreateController(args.tipoService);
  }
}

