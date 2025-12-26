import { ICategoriaGetService } from "../../../../services/producto/categoria/get/categoriaGet.service";
import { CategoriaGetController } from "./categoriaGet.controller";
import { CategoriaGetValidator } from "./categoriaGet.validator";

export interface CategoriaGetEndpointArgs {
  categoriaService: ICategoriaGetService;
}

export class CategoriaGetEndpoint {
  public validator: CategoriaGetValidator;
  public controller: CategoriaGetController;

  constructor(args: CategoriaGetEndpointArgs) {
    this.validator = new CategoriaGetValidator();
    this.controller = new CategoriaGetController(args.categoriaService);
  }
}

