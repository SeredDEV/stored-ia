import { ICategoriaUpdateService } from "../../../../services/producto/categoria/update/categoriaUpdate.service";
import { CategoriaUpdateController } from "./categoriaUpdate.controller";
import { CategoriaUpdateValidator } from "./categoriaUpdate.validator";
import { CategoriaUpdateParamsValidator } from "./categoriaUpdate.paramsValidator";

export interface CategoriaUpdateEndpointArgs {
  categoriaService: ICategoriaUpdateService;
}

export class CategoriaUpdateEndpoint {
  public validator: CategoriaUpdateValidator;
  public paramsValidator: CategoriaUpdateParamsValidator;
  public controller: CategoriaUpdateController;

  constructor(args: CategoriaUpdateEndpointArgs) {
    this.validator = new CategoriaUpdateValidator();
    this.paramsValidator = new CategoriaUpdateParamsValidator();
    this.controller = new CategoriaUpdateController(args.categoriaService);
  }
}
