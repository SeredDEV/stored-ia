import { Router, type Express } from "express";
import type {
  IProductoCreateService,
  IProductoCategoriaService,
} from "../../services/producto/productoModel";
import { ProductoCreateEndpoint } from "./create/productoCreate.endpoint";
import { ProductoCreateNetwork } from "./create/productoCreate.network";
import { ProductoGetEndpoint } from "./get/productoGet.endpoint";
import { ProductoGetNetwork } from "./get/productoGet.network";
import { ProductoListEndpoint } from "./list/productoList.endpoint";
import { ProductoListNetwork } from "./list/productoList.network";
import { ProductoUpdateEndpoint } from "./update/productoUpdate.endpoint";
import { ProductoUpdateNetwork } from "./update/productoUpdate.network";
import { ProductoDeleteEndpoint } from "./delete/productoDelete.endpoint";
import { ProductoDeleteNetwork } from "./delete/productoDelete.network";
import { CategoriaCreateEndpoint } from "./categoria/create/categoriaCreate.endpoint";
import { CategoriaCreateNetwork } from "./categoria/create/categoriaCreate.network";
import { CategoriaListEndpoint } from "./categoria/list/categoriaList.endpoint";
import { CategoriaListNetwork } from "./categoria/list/categoriaList.network";
import { CategoriaGetEndpoint } from "./categoria/get/categoriaGet.endpoint";
import { CategoriaGetNetwork } from "./categoria/get/categoriaGet.network";
import { CategoriaUpdateEndpoint } from "./categoria/update/categoriaUpdate.endpoint";
import { CategoriaUpdateNetwork } from "./categoria/update/categoriaUpdate.network";
import { CategoriaDeleteEndpoint } from "./categoria/delete/categoriaDelete.endpoint";
import { CategoriaDeleteNetwork } from "./categoria/delete/categoriaDelete.network";
import { ColeccionCreateEndpoint } from "./coleccion/create/coleccionCreate.endpoint";
import { ColeccionCreateNetwork } from "./coleccion/create/coleccionCreate.network";
import { ColeccionListEndpoint } from "./coleccion/list/coleccionList.endpoint";
import { ColeccionListNetwork } from "./coleccion/list/coleccionList.network";
import { ColeccionGetEndpoint } from "./coleccion/get/coleccionGet.endpoint";
import { ColeccionGetNetwork } from "./coleccion/get/coleccionGet.network";
import { ColeccionUpdateEndpoint } from "./coleccion/update/coleccionUpdate.endpoint";
import { ColeccionUpdateNetwork } from "./coleccion/update/coleccionUpdate.network";
import { ColeccionDeleteEndpoint } from "./coleccion/delete/coleccionDelete.endpoint";
import { ColeccionDeleteNetwork } from "./coleccion/delete/coleccionDelete.network";
import { EtiquetaCreateEndpoint } from "./etiqueta/create/etiquetaCreate.endpoint";
import { EtiquetaCreateNetwork } from "./etiqueta/create/etiquetaCreate.network";
import { EtiquetaListEndpoint } from "./etiqueta/list/etiquetaList.endpoint";
import { EtiquetaListNetwork } from "./etiqueta/list/etiquetaList.network";
import { EtiquetaGetEndpoint } from "./etiqueta/get/etiquetaGet.endpoint";
import { EtiquetaGetNetwork } from "./etiqueta/get/etiquetaGet.network";
import { EtiquetaUpdateEndpoint } from "./etiqueta/update/etiquetaUpdate.endpoint";
import { EtiquetaUpdateNetwork } from "./etiqueta/update/etiquetaUpdate.network";
import { EtiquetaDeleteEndpoint } from "./etiqueta/delete/etiquetaDelete.endpoint";
import { EtiquetaDeleteNetwork } from "./etiqueta/delete/etiquetaDelete.network";
import { TipoCreateEndpoint } from "./tipo/create/tipoCreate.endpoint";
import { TipoCreateNetwork } from "./tipo/create/tipoCreate.network";
import { TipoListEndpoint } from "./tipo/list/tipoList.endpoint";
import { TipoListNetwork } from "./tipo/list/tipoList.network";
import { TipoGetEndpoint } from "./tipo/get/tipoGet.endpoint";
import { TipoGetNetwork } from "./tipo/get/tipoGet.network";
import { TipoUpdateEndpoint } from "./tipo/update/tipoUpdate.endpoint";
import { TipoUpdateNetwork } from "./tipo/update/tipoUpdate.network";
import { TipoDeleteEndpoint } from "./tipo/delete/tipoDelete.endpoint";
import { TipoDeleteNetwork } from "./tipo/delete/tipoDelete.network";
import { VarianteCreateEndpoint } from "./variante/create/varianteCreate.endpoint";
import { VarianteCreateNetwork } from "./variante/create/varianteCreate.network";
import { VarianteListEndpoint } from "./variante/list/varianteList.endpoint";
import { VarianteListNetwork } from "./variante/list/varianteList.network";
import { VarianteGetEndpoint } from "./variante/get/varianteGet.endpoint";
import { VarianteGetNetwork } from "./variante/get/varianteGet.network";
import { VarianteUpdateEndpoint } from "./variante/update/varianteUpdate.endpoint";
import { VarianteUpdateNetwork } from "./variante/update/varianteUpdate.network";
import { VarianteDeleteEndpoint } from "./variante/delete/varianteDelete.endpoint";
import { VarianteDeleteNetwork } from "./variante/delete/varianteDelete.network";
import { ProductoGetServiceBuilder } from "../../services/producto/get";
import { ProductoListServiceBuilder } from "../../services/producto/list";
import { ProductoUpdateServiceBuilder } from "../../services/producto/update";
import { ProductoDeleteServiceBuilder } from "../../services/producto/delete";

import { CategoriaCreateServiceBuilder } from "../../services/producto/categoria/create";
import { CategoriaGetServiceBuilder } from "../../services/producto/categoria/get";
import { CategoriaListServiceBuilder } from "../../services/producto/categoria/list";
import { CategoriaUpdateServiceBuilder } from "../../services/producto/categoria/update";
import { CategoriaDeleteServiceBuilder } from "../../services/producto/categoria/delete";

import { EtiquetaCreateServiceBuilder } from "../../services/producto/etiqueta/create";
import { EtiquetaGetServiceBuilder } from "../../services/producto/etiqueta/get";
import { EtiquetaListServiceBuilder } from "../../services/producto/etiqueta/list";
import { EtiquetaUpdateServiceBuilder } from "../../services/producto/etiqueta/update";
import { EtiquetaDeleteServiceBuilder } from "../../services/producto/etiqueta/delete";

import { ColeccionCreateServiceBuilder } from "../../services/producto/coleccion/create";
import { ColeccionGetServiceBuilder } from "../../services/producto/coleccion/get";
import { ColeccionListServiceBuilder } from "../../services/producto/coleccion/list";
import { ColeccionUpdateServiceBuilder } from "../../services/producto/coleccion/update";
import { ColeccionDeleteServiceBuilder } from "../../services/producto/coleccion/delete";

import { TipoCreateServiceBuilder } from "../../services/producto/tipo/create";
import { TipoGetServiceBuilder } from "../../services/producto/tipo/get";
import { TipoListServiceBuilder } from "../../services/producto/tipo/list";
import { TipoUpdateServiceBuilder } from "../../services/producto/tipo/update";
import { TipoDeleteServiceBuilder } from "../../services/producto/tipo/delete";

import { VarianteCreateServiceBuilder } from "../../services/producto/variante/create";
import { VarianteGetServiceBuilder } from "../../services/producto/variante/get";
import { VarianteListServiceBuilder } from "../../services/producto/variante/list";
import { VarianteUpdateServiceBuilder } from "../../services/producto/variante/update";
import { VarianteDeleteServiceBuilder } from "../../services/producto/variante/delete";

/**
 * Router de productos.
 * Registra todas las rutas de productos en el servidor.
 */
export class ProductoRoute {
  public static register(
    server: Express,
    productoCreateService: IProductoCreateService
  ): void {
    const productosRouter = Router();
    const categoriasRouter = Router();
    const etiquetasRouter = Router();
    const coleccionesRouter = Router();
    const tiposRouter = Router();
    const variantesRouter = Router();

    // Servicios - Crear instancias usando los builders
    // Producto
    const productoGetService = new ProductoGetServiceBuilder().build();
    const productoListService = new ProductoListServiceBuilder().build();
    const productoUpdateService = new ProductoUpdateServiceBuilder().build();
    const productoDeleteService = new ProductoDeleteServiceBuilder().build();

    // Categoría
    const categoriaCreateService = new CategoriaCreateServiceBuilder().build();
    const categoriaGetService = new CategoriaGetServiceBuilder().build();
    const categoriaListService = new CategoriaListServiceBuilder().build();
    const categoriaUpdateService = new CategoriaUpdateServiceBuilder().build();
    const categoriaDeleteService = new CategoriaDeleteServiceBuilder().build();

    const etiquetaCreateService = new EtiquetaCreateServiceBuilder().build();
    const etiquetaGetService = new EtiquetaGetServiceBuilder().build();
    const etiquetaListService = new EtiquetaListServiceBuilder().build();
    const etiquetaUpdateService = new EtiquetaUpdateServiceBuilder().build();
    const etiquetaDeleteService = new EtiquetaDeleteServiceBuilder().build();

    const coleccionCreateService = new ColeccionCreateServiceBuilder().build();
    const coleccionGetService = new ColeccionGetServiceBuilder().build();
    const coleccionListService = new ColeccionListServiceBuilder().build();
    const coleccionUpdateService = new ColeccionUpdateServiceBuilder().build();
    const coleccionDeleteService = new ColeccionDeleteServiceBuilder().build();

    const tipoCreateService = new TipoCreateServiceBuilder().build();
    const tipoGetService = new TipoGetServiceBuilder().build();
    const tipoListService = new TipoListServiceBuilder().build();
    const tipoUpdateService = new TipoUpdateServiceBuilder().build();
    const tipoDeleteService = new TipoDeleteServiceBuilder().build();

    const varianteCreateService = new VarianteCreateServiceBuilder().build();
    const varianteGetService = new VarianteGetServiceBuilder().build();
    const varianteListService = new VarianteListServiceBuilder().build();
    const varianteUpdateService = new VarianteUpdateServiceBuilder().build();
    const varianteDeleteService = new VarianteDeleteServiceBuilder().build();

    // ===== PRODUCTOS =====
    const productoCreateEndpoint = new ProductoCreateEndpoint({
      productoCreateService,
    });
    const productoCreateNetwork = new ProductoCreateNetwork(
      productoCreateEndpoint
    );
    productoCreateNetwork.setNetwork(productosRouter);

    // ===== CATEGORÍAS =====
    // Create
    const categoriaCreateEndpoint = new CategoriaCreateEndpoint({
      categoriaService: categoriaCreateService,
    });
    const categoriaCreateNetwork = new CategoriaCreateNetwork(
      categoriaCreateEndpoint
    );
    categoriaCreateNetwork.setNetwork(categoriasRouter);

    // List
    const categoriaListEndpoint = new CategoriaListEndpoint({
      categoriaService: categoriaListService,
    });
    const categoriaListNetwork = new CategoriaListNetwork(
      categoriaListEndpoint
    );
    categoriaListNetwork.setNetwork(categoriasRouter);

    // Get
    const categoriaGetEndpoint = new CategoriaGetEndpoint({
      categoriaService: categoriaGetService,
    });
    const categoriaGetNetwork = new CategoriaGetNetwork(categoriaGetEndpoint);
    categoriaGetNetwork.setNetwork(categoriasRouter);

    // Update
    const categoriaUpdateEndpoint = new CategoriaUpdateEndpoint({
      categoriaService: categoriaUpdateService,
    });
    const categoriaUpdateNetwork = new CategoriaUpdateNetwork(
      categoriaUpdateEndpoint
    );
    categoriaUpdateNetwork.setNetwork(categoriasRouter);

    // Delete
    const categoriaDeleteEndpoint = new CategoriaDeleteEndpoint({
      categoriaService: categoriaDeleteService,
    });
    const categoriaDeleteNetwork = new CategoriaDeleteNetwork(
      categoriaDeleteEndpoint
    );
    categoriaDeleteNetwork.setNetwork(categoriasRouter);

    // ===== COLECCIONES =====
    // Create
    const coleccionCreateEndpoint = new ColeccionCreateEndpoint({
      coleccionService: coleccionCreateService,
    });
    const coleccionCreateNetwork = new ColeccionCreateNetwork(
      coleccionCreateEndpoint
    );
    coleccionCreateNetwork.setNetwork(coleccionesRouter);

    // List
    const coleccionListEndpoint = new ColeccionListEndpoint({
      coleccionService: coleccionListService,
    });
    const coleccionListNetwork = new ColeccionListNetwork(
      coleccionListEndpoint
    );
    coleccionListNetwork.setNetwork(coleccionesRouter);

    // Get
    const coleccionGetEndpoint = new ColeccionGetEndpoint({
      coleccionService: coleccionGetService,
    });
    const coleccionGetNetwork = new ColeccionGetNetwork(coleccionGetEndpoint);
    coleccionGetNetwork.setNetwork(coleccionesRouter);

    // Update
    const coleccionUpdateEndpoint = new ColeccionUpdateEndpoint({
      coleccionService: coleccionUpdateService,
    });
    const coleccionUpdateNetwork = new ColeccionUpdateNetwork(
      coleccionUpdateEndpoint
    );
    coleccionUpdateNetwork.setNetwork(coleccionesRouter);

    // Delete
    const coleccionDeleteEndpoint = new ColeccionDeleteEndpoint({
      coleccionService: coleccionDeleteService,
    });
    const coleccionDeleteNetwork = new ColeccionDeleteNetwork(
      coleccionDeleteEndpoint
    );
    coleccionDeleteNetwork.setNetwork(coleccionesRouter);

    // ===== ETIQUETAS =====
    // Create
    const etiquetaCreateEndpoint = new EtiquetaCreateEndpoint({
      etiquetaService: etiquetaCreateService,
    });
    const etiquetaCreateNetwork = new EtiquetaCreateNetwork(
      etiquetaCreateEndpoint
    );
    etiquetaCreateNetwork.setNetwork(etiquetasRouter);

    // List
    const etiquetaListEndpoint = new EtiquetaListEndpoint({
      etiquetaService: etiquetaListService,
    });
    const etiquetaListNetwork = new EtiquetaListNetwork(etiquetaListEndpoint);
    etiquetaListNetwork.setNetwork(etiquetasRouter);

    // Get
    const etiquetaGetEndpoint = new EtiquetaGetEndpoint({
      etiquetaService: etiquetaGetService,
    });
    const etiquetaGetNetwork = new EtiquetaGetNetwork(etiquetaGetEndpoint);
    etiquetaGetNetwork.setNetwork(etiquetasRouter);

    // Update
    const etiquetaUpdateEndpoint = new EtiquetaUpdateEndpoint({
      etiquetaService: etiquetaUpdateService,
    });
    const etiquetaUpdateNetwork = new EtiquetaUpdateNetwork(
      etiquetaUpdateEndpoint
    );
    etiquetaUpdateNetwork.setNetwork(etiquetasRouter);

    // Delete
    const etiquetaDeleteEndpoint = new EtiquetaDeleteEndpoint({
      etiquetaService: etiquetaDeleteService,
    });
    const etiquetaDeleteNetwork = new EtiquetaDeleteNetwork(
      etiquetaDeleteEndpoint
    );
    etiquetaDeleteNetwork.setNetwork(etiquetasRouter);

    // ===== TIPOS =====
    // Create
    const tipoCreateEndpoint = new TipoCreateEndpoint({
      tipoService: tipoCreateService,
    });
    const tipoCreateNetwork = new TipoCreateNetwork(tipoCreateEndpoint);
    tipoCreateNetwork.setNetwork(tiposRouter);

    // List
    const tipoListEndpoint = new TipoListEndpoint({
      tipoService: tipoListService,
    });
    const tipoListNetwork = new TipoListNetwork(tipoListEndpoint);
    tipoListNetwork.setNetwork(tiposRouter);

    // Get
    const tipoGetEndpoint = new TipoGetEndpoint({
      tipoService: tipoGetService,
    });
    const tipoGetNetwork = new TipoGetNetwork(tipoGetEndpoint);
    tipoGetNetwork.setNetwork(tiposRouter);

    // Update
    const tipoUpdateEndpoint = new TipoUpdateEndpoint({
      tipoService: tipoUpdateService,
    });
    const tipoUpdateNetwork = new TipoUpdateNetwork(tipoUpdateEndpoint);
    tipoUpdateNetwork.setNetwork(tiposRouter);

    // Delete
    const tipoDeleteEndpoint = new TipoDeleteEndpoint({
      tipoService: tipoDeleteService,
    });
    const tipoDeleteNetwork = new TipoDeleteNetwork(tipoDeleteEndpoint);
    tipoDeleteNetwork.setNetwork(tiposRouter);

    // ===== VARIANTES =====
    // Create
    const varianteCreateEndpoint = new VarianteCreateEndpoint({
      varianteService: varianteCreateService,
    });
    const varianteCreateNetwork = new VarianteCreateNetwork(
      varianteCreateEndpoint
    );
    varianteCreateNetwork.setNetwork(variantesRouter);

    // List by producto
    const varianteListEndpoint = new VarianteListEndpoint({
      varianteService: varianteListService,
    });
    const varianteListNetwork = new VarianteListNetwork(varianteListEndpoint);
    varianteListNetwork.setNetwork(variantesRouter);

    // Get
    const varianteGetEndpoint = new VarianteGetEndpoint({
      varianteService: varianteGetService,
    });
    const varianteGetNetwork = new VarianteGetNetwork(varianteGetEndpoint);
    varianteGetNetwork.setNetwork(variantesRouter);

    // Update
    const varianteUpdateEndpoint = new VarianteUpdateEndpoint({
      varianteService: varianteUpdateService,
    });
    const varianteUpdateNetwork = new VarianteUpdateNetwork(
      varianteUpdateEndpoint
    );
    varianteUpdateNetwork.setNetwork(variantesRouter);

    // Delete
    const varianteDeleteEndpoint = new VarianteDeleteEndpoint({
      varianteService: varianteDeleteService,
    });
    const varianteDeleteNetwork = new VarianteDeleteNetwork(
      varianteDeleteEndpoint
    );
    varianteDeleteNetwork.setNetwork(variantesRouter);

    // Registrar routers en el servidor
    server.use("/api/productos", productosRouter);
    server.use("/api/categorias", categoriasRouter);
    server.use("/api/etiquetas", etiquetasRouter);
    server.use("/api/colecciones", coleccionesRouter);
    server.use("/api/tipos", tiposRouter);
    server.use("/api/variantes", variantesRouter);
  }
}
