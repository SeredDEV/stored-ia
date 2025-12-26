import { ITipoListService } from "../../../../services/producto/tipo/list/tipoList.service";
import { TipoListController } from "./tipoList.controller";

export interface TipoListEndpointArgs {
  tipoService: ITipoListService;
}

export class TipoListEndpoint {
  public controller: TipoListController;

  constructor(args: TipoListEndpointArgs) {
    this.controller = new TipoListController(args.tipoService);
  }
}

