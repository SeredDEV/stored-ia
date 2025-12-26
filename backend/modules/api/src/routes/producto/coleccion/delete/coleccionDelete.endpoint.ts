import { IColeccionDeleteService } from "../../../../services/producto/coleccion/delete/coleccionDelete.service";
import { ColeccionDeleteController } from "./coleccionDelete.controller";
import { ColeccionDeleteValidator } from "./coleccionDelete.validator";

export interface ColeccionDeleteEndpointArgs {
  coleccionService: IColeccionDeleteService;
}

export class ColeccionDeleteEndpoint {
  public validator: ColeccionDeleteValidator;
  public controller: ColeccionDeleteController;

  constructor(args: ColeccionDeleteEndpointArgs) {
    this.validator = new ColeccionDeleteValidator();
    this.controller = new ColeccionDeleteController(args.coleccionService);
  }
}

