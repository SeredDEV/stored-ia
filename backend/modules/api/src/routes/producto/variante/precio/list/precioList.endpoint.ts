import { PrecioListController } from "./precioList.controller";
import { IPrecioListService } from "../../../../../services/producto/variante/precio/list/precioList.service";

export interface PrecioListEndpointArgs {
  precioService: IPrecioListService;
}

export class PrecioListEndpoint {
  public controller: PrecioListController;

  constructor(args: PrecioListEndpointArgs) {
    this.controller = new PrecioListController(args.precioService);
  }
}
