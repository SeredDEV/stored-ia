import { IVarianteDeleteService } from "../../../../services/producto/variante/delete/varianteDelete.service";
import { VarianteDeleteController } from "./varianteDelete.controller";

export interface VarianteDeleteEndpointArgs {
  varianteService: IVarianteDeleteService;
}

export class VarianteDeleteEndpoint {
  public controller: VarianteDeleteController;

  constructor(args: VarianteDeleteEndpointArgs) {
    this.controller = new VarianteDeleteController(args.varianteService);
  }
}
