import { PrecioUpdateController } from "./precioUpdate.controller";
import { PrecioUpdateValidator } from "./precioUpdate.validator";
import { IPrecioUpdateService } from "../../../../services/producto/precio/update/precioUpdate.service";

export interface PrecioUpdateEndpointArgs {
  precioService: IPrecioUpdateService;
}

export class PrecioUpdateEndpoint {
  public validator: PrecioUpdateValidator;
  public controller: PrecioUpdateController;

  constructor(args: PrecioUpdateEndpointArgs) {
    this.validator = new PrecioUpdateValidator();
    this.controller = new PrecioUpdateController(args.precioService);
  }
}
