import { IVarianteCreateService } from "../../../../services/producto/variante/create/varianteCreate.service";
import { VarianteCreateController } from "./varianteCreate.controller";
import { VarianteCreateValidator } from "./varianteCreate.validator";

export interface VarianteCreateEndpointArgs {
  varianteService: IVarianteCreateService;
}

export class VarianteCreateEndpoint {
  public validator: VarianteCreateValidator;
  public controller: VarianteCreateController;

  constructor(args: VarianteCreateEndpointArgs) {
    this.validator = new VarianteCreateValidator();
    this.controller = new VarianteCreateController(args.varianteService);
  }
}

