import { PrecioCreateController } from "./precioCreate.controller";
import { PrecioCreateValidator } from "./precioCreate.validator";
import { IPrecioCreateService } from "../../../../../services/producto/variante/precio/create/precioCreate.service";

export interface PrecioCreateEndpointArgs {
  precioService: IPrecioCreateService;
}

export class PrecioCreateEndpoint {
  public validator: PrecioCreateValidator;
  public controller: PrecioCreateController;

  constructor(args: PrecioCreateEndpointArgs) {
    this.validator = new PrecioCreateValidator();
    this.controller = new PrecioCreateController(args.precioService);
  }
}
