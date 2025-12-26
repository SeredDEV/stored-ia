import { IProductoUpdateService } from "../../../services/producto/update/productoUpdate.service";
import { ProductoUpdateController } from "./productoUpdate.controller";
import { ProductoUpdateValidator } from "./productoUpdate.validator";

export interface ProductoUpdateEndpointArgs {
  productoService: IProductoUpdateService;
}

export class ProductoUpdateEndpoint {
  public validator: ReturnType<typeof ProductoUpdateValidator.create>;
  public controller: ProductoUpdateController;

  constructor(args: ProductoUpdateEndpointArgs) {
    this.validator = ProductoUpdateValidator.create();
    this.controller = new ProductoUpdateController(args.productoService);
  }
}

