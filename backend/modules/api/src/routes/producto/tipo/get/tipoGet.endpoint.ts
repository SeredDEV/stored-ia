import { ITipoGetService } from "../../../../services/producto/tipo/get/tipoGet.service";
import { TipoGetController } from "./tipoGet.controller";

export interface TipoGetEndpointArgs {
  tipoService: ITipoGetService;
}

export class TipoGetEndpoint {
  public controller: TipoGetController;

  constructor(args: TipoGetEndpointArgs) {
    this.controller = new TipoGetController(args.tipoService);
  }
}

