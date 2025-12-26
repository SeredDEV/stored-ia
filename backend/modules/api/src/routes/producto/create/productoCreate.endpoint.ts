import { IProductoCreateService } from "../../../services/producto/productoModel";
import { ProductoCreateController } from "./productoCreate.controller";
import { ProductoCreateValidator } from "./productoCreate.validator";

export interface ProductoCreateEndpointArgs {
  productoCreateService: IProductoCreateService;
}

export class ProductoCreateEndpoint {
  public validator: ProductoCreateValidator;
  public controller: ProductoCreateController;

  constructor(args: ProductoCreateEndpointArgs) {
    this.validator = new ProductoCreateValidator();
    this.controller = new ProductoCreateController(args.productoCreateService);
  }
}

