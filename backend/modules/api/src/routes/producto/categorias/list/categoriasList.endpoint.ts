import type { ICategoriaListByProductoService } from "../../../../services/producto/categoria/list-by-producto";
import { CategoriasListController } from "./categoriasList.controller";
import { CategoriasListValidator } from "./categoriasList.validator";

export class CategoriasListEndpoint {
  public validator: CategoriasListValidator;
  public controller: CategoriasListController;

  constructor(service: ICategoriaListByProductoService) {
    this.validator = new CategoriasListValidator();
    this.controller = new CategoriasListController(service);
  }
}
