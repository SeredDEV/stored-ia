import { IColeccionListService } from "../../../../services/producto/coleccion/list/coleccionList.service";
import { ColeccionListController } from "./coleccionList.controller";

export interface ColeccionListEndpointArgs {
  coleccionService: IColeccionListService;
}

export class ColeccionListEndpoint {
  public controller: ColeccionListController;

  constructor(args: ColeccionListEndpointArgs) {
    this.controller = new ColeccionListController(args.coleccionService);
  }
}

