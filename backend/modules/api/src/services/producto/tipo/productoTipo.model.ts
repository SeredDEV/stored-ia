export interface TipoProducto {
  id: string;
  valor: string;
  metadatos?: Record<string, any>;
  fecha_creacion: string;
  fecha_actualizacion: string;
  fecha_eliminacion?: string;
}

export interface CreateTipoProductoInput {
  valor: string;
  metadatos?: Record<string, any>;
}

export interface IProductoTipoService {
  createTipo(input: CreateTipoProductoInput): Promise<TipoProducto>;
  getTipo(id: string): Promise<TipoProducto>;
  getTipoByValor(valor: string): Promise<TipoProducto | null>;
  listTipos(): Promise<TipoProducto[]>;
  updateTipo(
    id: string,
    input: Partial<CreateTipoProductoInput>
  ): Promise<TipoProducto>;
  deleteTipo(id: string): Promise<void>;
}

