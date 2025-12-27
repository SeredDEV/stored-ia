import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { ensureSupabaseConfig } from "../../../config/env";
import type {
  CreateProductoInput,
  IProductoCreateService,
  Producto,
  VarianteBasic,
} from "../productoModel";
import type {
  ErrorDictionaryGenerator,
  RValidationsNamesProductoCreate,
} from "./productoCreate.dictionary";
import type {
  IStorageUploadService,
  IStorageDeleteService,
} from "../storage/productoStorage.model";
import { StorageUploadServiceBuilder } from "../storage/upload";
import { StorageDeleteServiceBuilder } from "../storage/delete";
import type { ITipoGetService } from "../tipo/get/tipoGet.service";
import type { IColeccionGetService } from "../coleccion/get/coleccionGet.service";
import type { ICategoriaGetService } from "../categoria/get/categoriaGet.service";
import type { IEtiquetaGetService } from "../etiqueta/get/etiquetaGet.service";
import { TipoGetServiceBuilder } from "../tipo/get";
import { ColeccionGetServiceBuilder } from "../coleccion/get";
import { CategoriaGetServiceBuilder } from "../categoria/get";
import { EtiquetaGetServiceBuilder } from "../etiqueta/get";

/**
 * Implementación del servicio de creación de productos usando Supabase.
 */
export class ProductoCreateService implements IProductoCreateService {
  private uploadService: IStorageUploadService;
  private deleteService: IStorageDeleteService;
  private tipoGetService: ITipoGetService;
  private coleccionGetService: IColeccionGetService;
  private categoriaGetService: ICategoriaGetService;
  private etiquetaGetService: IEtiquetaGetService;

  constructor(
    private readonly supabaseClient: SupabaseClient,
    private readonly errorDictionaryGenerator?: ErrorDictionaryGenerator<RValidationsNamesProductoCreate>,
    uploadService?: IStorageUploadService,
    deleteService?: IStorageDeleteService,
    tipoGetService?: ITipoGetService,
    coleccionGetService?: IColeccionGetService,
    categoriaGetService?: ICategoriaGetService,
    etiquetaGetService?: IEtiquetaGetService
  ) {
    // Si no se proporcionan servicios, crear por defecto
    this.uploadService =
      uploadService ||
      new StorageUploadServiceBuilder()
        .setSupabaseClient(supabaseClient)
        .build();
    this.deleteService =
      deleteService ||
      new StorageDeleteServiceBuilder()
        .setSupabaseClient(supabaseClient)
        .build();
    this.tipoGetService =
      tipoGetService ||
      new TipoGetServiceBuilder().setSupabaseClient(supabaseClient).build();
    this.coleccionGetService =
      coleccionGetService ||
      new ColeccionGetServiceBuilder()
        .setSupabaseClient(supabaseClient)
        .build();
    this.categoriaGetService =
      categoriaGetService ||
      new CategoriaGetServiceBuilder()
        .setSupabaseClient(supabaseClient)
        .build();
    this.etiquetaGetService =
      etiquetaGetService ||
      new EtiquetaGetServiceBuilder().setSupabaseClient(supabaseClient).build();
  }

  /**
   * Fábrica para crear el servicio usando la configuración centralizada.
   */
  static fromConfig(): ProductoCreateService {
    const { url, serviceRoleKey } = ensureSupabaseConfig();
    const client = createClient(url, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
    return new ProductoCreateService(client);
  }

  /**
   * Valida que las relaciones (tipo, colección, categorías, etiquetas) existan
   * Usa inyección de dependencias con los servicios get de cada módulo
   */
  private async validateRelations(data: {
    tipo_producto_id?: string;
    coleccion_id?: string;
    categorias?: string[];
    etiquetas?: string[];
  }): Promise<void> {
    const { tipo_producto_id, coleccion_id, categorias, etiquetas } = data;

    // Validar tipo de producto usando el servicio inyectado
    if (tipo_producto_id) {
      try {
        await this.tipoGetService.execute(tipo_producto_id);
      } catch (error) {
        throw new Error(
          JSON.stringify({
            dictionaryId: "tipoProductoNotFound",
            statusCode: 404,
            defaultMessage: "El tipo de producto especificado no existe",
          })
        );
      }
    }

    // Validar colección usando el servicio inyectado
    if (coleccion_id) {
      try {
        await this.coleccionGetService.execute(coleccion_id);
      } catch (error) {
        throw new Error(
          JSON.stringify({
            dictionaryId: "coleccionNotFound",
            statusCode: 404,
            defaultMessage: "La colección especificada no existe",
          })
        );
      }
    }

    // Validar categorías usando el servicio inyectado
    if (categorias && categorias.length > 0) {
      try {
        const validationPromises = categorias.map((id) =>
          this.categoriaGetService.execute(id)
        );
        await Promise.all(validationPromises);
      } catch (error) {
        throw new Error(
          JSON.stringify({
            dictionaryId: "categoriaNotFound",
            statusCode: 404,
            defaultMessage: "Una o más categorías especificadas no existen",
          })
        );
      }
    }

    // Validar etiquetas usando el servicio inyectado
    if (etiquetas && etiquetas.length > 0) {
      try {
        const validationPromises = etiquetas.map((id) =>
          this.etiquetaGetService.execute(id)
        );
        await Promise.all(validationPromises);
      } catch (error) {
        throw new Error(
          JSON.stringify({
            dictionaryId: "etiquetaNotFound",
            statusCode: 404,
            defaultMessage: "Una o más etiquetas especificadas no existen",
          })
        );
      }
    }
  }

  /**
   * Crea un producto (solo la tabla producto y sus relaciones)
   * Las variantes, opciones y demás se crean con sus propios endpoints
   */
  async createProducto(input: CreateProductoInput): Promise<Producto> {
    const {
      titulo,
      subtitulo,
      descripcion,
      slug,
      miniatura,
      imagenes,
      tiene_descuento,
      tipo_producto_id,
      coleccion_id,
      categorias,
      etiquetas,
    } = input;

    // 1. Validar que las relaciones existan
    await this.validateRelations({
      tipo_producto_id,
      coleccion_id,
      categorias,
      etiquetas,
    });

    // 2. Procesar miniatura (subir si es archivo)
    let miniaturaUrl: string | undefined = undefined;
    if (miniatura) {
      if (typeof miniatura === "string") {
        // Ya es una URL
        miniaturaUrl = miniatura;
      } else {
        // Es un archivo, subirlo a Supabase Storage
        miniaturaUrl = await this.uploadService.execute({
          file: miniatura.buffer,
          fileName: miniatura.fileName,
          contentType: miniatura.contentType,
        });
      }
    }

    // 3. Procesar imágenes (subir si son archivos)
    let imagenesUrls: string[] = [];
    if (imagenes && imagenes.length > 0) {
      const uploadPromises = imagenes.map(async (imagen) => {
        if (typeof imagen === "string") {
          // Ya es una URL
          return imagen;
        } else {
          // Es un archivo, subirlo a Supabase Storage
          return await this.uploadService.execute({
            file: imagen.buffer,
            fileName: imagen.fileName,
            contentType: imagen.contentType,
          });
        }
      });

      imagenesUrls = await Promise.all(uploadPromises);
    }

    // 4. Crear el producto
    const { data: producto, error: errorProducto } = await this.supabaseClient
      .from("producto")
      .insert({
        id: crypto.randomUUID(),
        titulo,
        subtitulo,
        descripcion,
        slug,
        miniatura: miniaturaUrl,
        estado: "borrador",
        tiene_descuento,
        tipo_producto_id,
        coleccion_id,
        fecha_creacion: new Date().toISOString(),
        fecha_actualizacion: new Date().toISOString(),
      })
      .select()
      .single();

    if (errorProducto)
      throw new Error(`Error al crear producto: ${errorProducto.message}`);

    // 5. Guardar imágenes en la tabla imagen_producto
    if (imagenesUrls.length > 0) {
      const imagenesData = imagenesUrls.map((url, index) => ({
        id: crypto.randomUUID(),
        producto_id: producto.id,
        url,
        rango: index,
      }));

      await this.supabaseClient.from("imagen_producto").insert(imagenesData);
    }

    // 6. Relacionar con categorías
    if (categorias && categorias.length > 0) {
      const categoriasData = categorias.map((cat_id) => ({
        categoria_producto_id: cat_id,
        producto_id: producto.id,
      }));

      await this.supabaseClient
        .from("categoria_producto_producto")
        .insert(categoriasData);
    }

    // 7. Relacionar con etiquetas
    if (etiquetas && etiquetas.length > 0) {
      const etiquetasData = etiquetas.map((etiq_id) => ({
        etiqueta_producto_id: etiq_id,
        producto_id: producto.id,
      }));

      await this.supabaseClient
        .from("producto_etiquetas")
        .insert(etiquetasData);
    }

    // 8. Retornar el producto creado
    // Las variantes y opciones se crean con sus propios endpoints
    return producto;
  }
}
