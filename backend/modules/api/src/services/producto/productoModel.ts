import { createClient } from "@supabase/supabase-js";

// ===== RE-EXPORTAR INTERFACES DE SERVICIOS RELACIONADOS =====
export type {
  Categoria,
  CreateCategoriaInput,
  IProductoCategoriaService,
} from "./categoria/productoCategoria.model";
export type {
  Etiqueta,
  CreateEtiquetaInput,
  IProductoEtiquetaService,
} from "./etiqueta/productoEtiqueta.model";
export type {
  Coleccion,
  CreateColeccionInput,
  IProductoColeccionService,
} from "./coleccion/productoColeccion.model";
export type {
  TipoProducto,
  CreateTipoProductoInput,
  IProductoTipoService,
} from "./tipo/productoTipo.model";
export type {
  Variante,
  CreateVarianteInput,
  IProductoVarianteService,
} from "./variante/productoVariante.model";
export type {
  IStorageUploadService,
  IStorageDeleteService,
  UploadMediaInput,
} from "./storage/productoStorage.model";

// ===== INTERFACES =====

export interface CreateProductoInput {
  // Detalles
  titulo: string;
  subtitulo?: string;
  descripcion?: string;
  slug: string;
  miniatura?:
    | string
    | { buffer: string; fileName: string; contentType?: string }; // URL o archivo base64
  imagenes?: Array<
    string | { buffer: string; fileName: string; contentType?: string }
  >; // URLs o archivos base64

  // Organizar
  tiene_descuento: boolean;
  tipo_producto_id?: string;
  coleccion_id?: string;
  categorias?: string[];
  etiquetas?: string[];

  // Variantes
  tiene_variantes: boolean;
  opciones?: Array<{
    titulo: string;
    valores: string[];
  }>;

  // Estado
  estado?: "borrador" | "publicado" | "inactivo";
}

export interface CreateVarianteBasicInput {
  producto_id: string;
  titulo: string;
  sku?: string;
  peso?: number;
  gestionar_inventario: boolean;
  permitir_pedido_pendiente: boolean;
  opciones: Record<string, string>; // { "Color": "Rojo", "Talla": "M" }
}

export interface CreatePrecioInput {
  variante_id: string;
  monto: number; // En centavos
  codigo_moneda: string;
}

export interface Producto {
  id: string;
  titulo: string;
  subtitulo?: string;
  descripcion?: string;
  slug: string;
  estado: string;
  miniatura?: string;
  tiene_descuento: boolean;
  tipo_producto_id?: string;
  coleccion_id?: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

export interface VarianteBasic {
  id: string;
  producto_id: string;
  titulo: string;
  sku?: string;
  peso?: number;
  gestionar_inventario: boolean;
  permitir_pedido_pendiente: boolean;
}

// ===== INTERFACE DEL SERVICIO =====

export interface IProductoCreateService {
  createProducto(input: CreateProductoInput): Promise<Producto>;
}
