import { IProductoGetService } from "../../../services/producto/get/productoGet.service";
import { ProductoGetController } from "./productoGet.controller";
import { ProductoGetValidator } from "./productoGet.validator";

export interface ProductoGetEndpointArgs {
  productoService: IProductoGetService;
}

export class ProductoGetEndpoint {
  public validator: ReturnType<typeof ProductoGetValidator.create>;
  public controller: ProductoGetController;

  constructor(args: ProductoGetEndpointArgs) {
    this.validator = ProductoGetValidator.create();
    this.controller = new ProductoGetController(args.productoService);
  }
}

