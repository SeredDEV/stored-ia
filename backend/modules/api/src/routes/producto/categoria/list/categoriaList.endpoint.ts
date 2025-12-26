import { ICategoriaListService } from "../../../../services/producto/categoria/list/categoriaList.service";
import { CategoriaListController } from "./categoriaList.controller";

export interface CategoriaListEndpointArgs {
  categoriaService: ICategoriaListService;
}

export class CategoriaListEndpoint {
  public controller: CategoriaListController;

  constructor(args: CategoriaListEndpointArgs) {
    this.controller = new CategoriaListController(args.categoriaService);
  }
}

