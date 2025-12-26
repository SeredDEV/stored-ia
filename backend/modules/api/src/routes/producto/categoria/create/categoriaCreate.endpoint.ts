import { ICategoriaCreateService } from "../../../../services/producto/categoria/create/categoriaCreate.service";
import { CategoriaCreateController } from "./categoriaCreate.controller";
import { CategoriaCreateValidator } from "./categoriaCreate.validator";

export interface CategoriaCreateEndpointArgs {
  categoriaService: ICategoriaCreateService;
}

export class CategoriaCreateEndpoint {
  public validator: CategoriaCreateValidator;
  public controller: CategoriaCreateController;

  constructor(args: CategoriaCreateEndpointArgs) {
    this.validator = new CategoriaCreateValidator();
    this.controller = new CategoriaCreateController(args.categoriaService);
  }
}

