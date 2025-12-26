import { ICategoriaDeleteService } from "../../../../services/producto/categoria/delete/categoriaDelete.service";
import { CategoriaDeleteController } from "./categoriaDelete.controller";
import { CategoriaDeleteValidator } from "./categoriaDelete.validator";

export interface CategoriaDeleteEndpointArgs {
  categoriaService: ICategoriaDeleteService;
}

export class CategoriaDeleteEndpoint {
  public validator: CategoriaDeleteValidator;
  public controller: CategoriaDeleteController;

  constructor(args: CategoriaDeleteEndpointArgs) {
    this.validator = new CategoriaDeleteValidator();
    this.controller = new CategoriaDeleteController(args.categoriaService);
  }
}

