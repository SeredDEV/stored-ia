import { IProductoListService } from "../../../services/producto/list/productoList.service";
import { ProductoListController } from "./productoList.controller";

export interface ProductoListEndpointArgs {
  productoService: IProductoListService;
}

export class ProductoListEndpoint {
  public controller: ProductoListController;

  constructor(args: ProductoListEndpointArgs) {
    this.controller = new ProductoListController(args.productoService);
  }
}

