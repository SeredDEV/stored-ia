import { IVarianteListService } from "../../../../services/producto/variante/list/varianteList.service";
import { VarianteListController } from "./varianteList.controller";

export interface VarianteListEndpointArgs {
  varianteService: IVarianteListService;
}

export class VarianteListEndpoint {
  public controller: VarianteListController;

  constructor(args: VarianteListEndpointArgs) {
    this.controller = new VarianteListController(args.varianteService);
  }
}

