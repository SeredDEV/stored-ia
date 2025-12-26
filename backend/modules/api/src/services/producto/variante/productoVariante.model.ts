export interface Variante {
  id: string;
  producto_id: string;
  titulo: string;
  sku?: string;
  codigo_barras?: string;
  ean?: string;
  upc?: string;
  miniatura?: string;
  permitir_pedido_pendiente: boolean;
  gestionar_inventario: boolean;
  peso?: number;
  largo?: number;
  alto?: number;
  ancho?: number;
  codigo_hs?: string;
  pais_origen?: string;
  codigo_mid?: string;
  material?: string;
  rango_variante?: number;
  metadatos?: Record<string, any>;
  fecha_creacion: string;
  fecha_actualizacion: string;
  fecha_eliminacion?: string;
}

export interface CreateVarianteInput {
  producto_id: string;
  titulo: string;
  sku?: string;
  codigo_barras?: string;
  ean?: string;
  upc?: string;
  miniatura?: string;
  permitir_pedido_pendiente?: boolean;
  gestionar_inventario?: boolean;
  peso?: number;
  largo?: number;
  alto?: number;
  ancho?: number;
  codigo_hs?: string;
  pais_origen?: string;
  codigo_mid?: string;
  material?: string;
  rango_variante?: number;
  metadatos?: Record<string, any>;
  opciones?: string[]; // Array de IDs de valor_opcion_producto
}

export interface IProductoVarianteService {
  createVariante(input: CreateVarianteInput): Promise<Variante>;
  getVariante(id: string): Promise<Variante>;
  listVariantesByProducto(producto_id: string): Promise<Variante[]>;
  updateVariante(
    id: string,
    input: Partial<CreateVarianteInput>
  ): Promise<Variante>;
  deleteVariante(id: string): Promise<void>;
}

