import { IColeccionCreateService } from "../../../../services/producto/coleccion/create/coleccionCreate.service";
import { ColeccionCreateController } from "./coleccionCreate.controller";
import { ColeccionCreateValidator } from "./coleccionCreate.validator";

export interface ColeccionCreateEndpointArgs {
  coleccionService: IColeccionCreateService;
}

export class ColeccionCreateEndpoint {
  public validator: ColeccionCreateValidator;
  public controller: ColeccionCreateController;

  constructor(args: ColeccionCreateEndpointArgs) {
    this.validator = new ColeccionCreateValidator();
    this.controller = new ColeccionCreateController(args.coleccionService);
  }
}

