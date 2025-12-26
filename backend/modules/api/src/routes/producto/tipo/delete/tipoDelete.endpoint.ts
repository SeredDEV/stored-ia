import { ITipoDeleteService } from "../../../../services/producto/tipo/delete/tipoDelete.service";
import { TipoDeleteController } from "./tipoDelete.controller";

export interface TipoDeleteEndpointArgs {
  tipoService: ITipoDeleteService;
}

export class TipoDeleteEndpoint {
  public controller: TipoDeleteController;

  constructor(args: TipoDeleteEndpointArgs) {
    this.controller = new TipoDeleteController(args.tipoService);
  }
}

