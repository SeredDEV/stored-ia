import { Router } from "express";
import type { ICategoriaAssignService } from "../../../../services/producto/categoria/assign";
import { CategoriasAssignController } from "./categoriasAssign.controller";
import { CategoriasAssignValidator } from "./categoriasAssign.validator";

export class CategoriasAssignEndpoint {
  public validator: CategoriasAssignValidator;
  public controller: CategoriasAssignController;

  constructor(service: ICategoriaAssignService) {
    this.validator = new CategoriasAssignValidator();
    this.controller = new CategoriasAssignController(service);
  }
}
