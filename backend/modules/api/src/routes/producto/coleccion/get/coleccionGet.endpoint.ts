import { IColeccionGetService } from "../../../../services/producto/coleccion/get/coleccionGet.service";
import { ColeccionGetController } from "./coleccionGet.controller";
import { ColeccionGetValidator } from "./coleccionGet.validator";

export interface ColeccionGetEndpointArgs {
  coleccionService: IColeccionGetService;
}

export class ColeccionGetEndpoint {
  public validator: ColeccionGetValidator;
  public controller: ColeccionGetController;

  constructor(args: ColeccionGetEndpointArgs) {
    this.validator = new ColeccionGetValidator();
    this.controller = new ColeccionGetController(args.coleccionService);
  }
}

