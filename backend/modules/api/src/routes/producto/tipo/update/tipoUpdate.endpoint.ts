import { ITipoUpdateService } from "../../../../services/producto/tipo/update/tipoUpdate.service";
import { TipoUpdateController } from "./tipoUpdate.controller";
import { TipoUpdateValidator } from "./tipoUpdate.validator";

export interface TipoUpdateEndpointArgs {
  tipoService: ITipoUpdateService;
}

export class TipoUpdateEndpoint {
  public validator: TipoUpdateValidator;
  public controller: TipoUpdateController;

  constructor(args: TipoUpdateEndpointArgs) {
    this.validator = new TipoUpdateValidator();
    this.controller = new TipoUpdateController(args.tipoService);
  }
}

