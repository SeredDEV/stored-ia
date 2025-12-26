import { IVarianteUpdateService } from "../../../../services/producto/variante/update/varianteUpdate.service";
import { VarianteUpdateController } from "./varianteUpdate.controller";
import { VarianteUpdateValidator } from "./varianteUpdate.validator";

export interface VarianteUpdateEndpointArgs {
  varianteService: IVarianteUpdateService;
}

export class VarianteUpdateEndpoint {
  public validator: VarianteUpdateValidator;
  public controller: VarianteUpdateController;

  constructor(args: VarianteUpdateEndpointArgs) {
    this.validator = new VarianteUpdateValidator();
    this.controller = new VarianteUpdateController(args.varianteService);
  }
}

