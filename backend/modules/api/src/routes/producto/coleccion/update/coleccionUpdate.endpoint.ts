import { IColeccionUpdateService } from "../../../../services/producto/coleccion/update/coleccionUpdate.service";
import { ColeccionUpdateController } from "./coleccionUpdate.controller";
import { ColeccionUpdateValidator } from "./coleccionUpdate.validator";
import { ColeccionUpdateParamsValidator } from "./coleccionUpdate.paramsValidator";

export interface ColeccionUpdateEndpointArgs {
  coleccionService: IColeccionUpdateService;
}

export class ColeccionUpdateEndpoint {
  public validator: ColeccionUpdateValidator;
  public paramsValidator: ColeccionUpdateParamsValidator;
  public controller: ColeccionUpdateController;

  constructor(args: ColeccionUpdateEndpointArgs) {
    this.validator = new ColeccionUpdateValidator();
    this.paramsValidator = new ColeccionUpdateParamsValidator();
    this.controller = new ColeccionUpdateController(args.coleccionService);
  }
}

