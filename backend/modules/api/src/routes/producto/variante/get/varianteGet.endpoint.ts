import { IVarianteGetService } from "../../../../services/producto/variante/get/varianteGet.service";
import { VarianteGetController } from "./varianteGet.controller";

export interface VarianteGetEndpointArgs {
  varianteService: IVarianteGetService;
}

export class VarianteGetEndpoint {
  public controller: VarianteGetController;

  constructor(args: VarianteGetEndpointArgs) {
    this.controller = new VarianteGetController(args.varianteService);
  }
}

