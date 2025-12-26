import { IProductoDeleteService } from "../../../services/producto/delete/productoDelete.service";
import { ProductoDeleteController } from "./productoDelete.controller";
import { ProductoDeleteValidator } from "./productoDelete.validator";

export interface ProductoDeleteEndpointArgs {
  productoService: IProductoDeleteService;
}

export class ProductoDeleteEndpoint {
  public validator: ReturnType<typeof ProductoDeleteValidator.create>;
  public controller: ProductoDeleteController;

  constructor(args: ProductoDeleteEndpointArgs) {
    this.validator = ProductoDeleteValidator.create();
    this.controller = new ProductoDeleteController(args.productoService);
  }
}

