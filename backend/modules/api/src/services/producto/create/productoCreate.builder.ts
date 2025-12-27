import { createClient } from "@supabase/supabase-js";
import { ensureSupabaseConfig } from "../../../config/env";
import type { IProductoCreateService } from "../productoModel";
import { ProductoCreateService } from "./productoCreate.service";
import type {
  ErrorDictionaryGenerator,
  RValidationsNamesProductoCreate,
} from "./productoCreate.dictionary";
import type {
  IStorageUploadService,
  IStorageDeleteService,
} from "../storage/productoStorage.model";
import { StorageUploadBuilder } from "../storage/upload";
import { StorageDeleteServiceBuilder } from "../storage/delete";
import type { ITipoGetService } from "../tipo/get/tipoGet.service";
import type { IColeccionGetService } from "../coleccion/get/coleccionGet.service";
import type { ICategoriaGetService } from "../categoria/get/categoriaGet.service";
import type { IEtiquetaGetService } from "../etiqueta/get/etiquetaGet.service";
import { TipoGetServiceBuilder } from "../tipo/get";
import { ColeccionGetServiceBuilder } from "../coleccion/get";
import { CategoriaGetServiceBuilder } from "../categoria/get";
import { EtiquetaGetServiceBuilder } from "../etiqueta/get";

export interface ProductoCreateServiceBuilderArgs {
  errorDictionaryGenerator?: ErrorDictionaryGenerator<RValidationsNamesProductoCreate>;
  uploadService?: IStorageUploadService;
  deleteService?: IStorageDeleteService;
  tipoGetService?: ITipoGetService;
  coleccionGetService?: IColeccionGetService;
  categoriaGetService?: ICategoriaGetService;
  etiquetaGetService?: IEtiquetaGetService;
}

/**
 * Builder para crear el servicio de creación de productos.
 */
export class ProductoCreateServiceBuilder {
  /**
   * Crea el servicio de creación de productos usando Supabase.
   * Puede recibir opcionalmente un generador de errores del diccionario.
   */
  public static build(
    args?: ProductoCreateServiceBuilderArgs
  ): IProductoCreateService {
    const { url, serviceRoleKey } = ensureSupabaseConfig();
    const client = createClient(url, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Crear servicios si no se proveen
    const uploadService =
      args?.uploadService ||
      new StorageUploadBuilder().setSupabaseClient(client).build();

    const deleteService =
      args?.deleteService ||
      new StorageDeleteServiceBuilder().setSupabaseClient(client).build();

    const tipoGetService =
      args?.tipoGetService ||
      new TipoGetServiceBuilder().setSupabaseClient(client).build();

    const coleccionGetService =
      args?.coleccionGetService ||
      new ColeccionGetServiceBuilder().setSupabaseClient(client).build();

    const categoriaGetService =
      args?.categoriaGetService ||
      new CategoriaGetServiceBuilder().setSupabaseClient(client).build();

    const etiquetaGetService =
      args?.etiquetaGetService ||
      new EtiquetaGetServiceBuilder().setSupabaseClient(client).build();

    return new ProductoCreateService(
      client,
      args?.errorDictionaryGenerator,
      uploadService,
      deleteService,
      tipoGetService,
      coleccionGetService,
      categoriaGetService,
      etiquetaGetService
    );
  }
}
