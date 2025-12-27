import type { ICategoriaRemoveService } from "../../../../services/producto/categoria/remove-from-producto";
import { CategoriaRemoveController } from "./categoriaRemove.controller";
import { CategoriaRemoveValidator } from "./categoriaRemove.validator";

export class CategoriaRemoveEndpoint {
  public validator: CategoriaRemoveValidator;
  public controller: CategoriaRemoveController;

  constructor(service: ICategoriaRemoveService) {
    this.validator = new CategoriaRemoveValidator();
    this.controller = new CategoriaRemoveController(service);
  }
}
