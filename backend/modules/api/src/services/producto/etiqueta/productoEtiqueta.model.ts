export interface Etiqueta {
  id: string;
  valor: string;
  metadatos?: Record<string, any>;
  fecha_creacion: string;
  fecha_actualizacion: string;
  fecha_eliminacion?: string;
}

export interface CreateEtiquetaInput {
  valor: string;
  metadatos?: Record<string, any>;
}

export interface IProductoEtiquetaService {
  createEtiqueta(input: CreateEtiquetaInput): Promise<Etiqueta>;
  getEtiqueta(id: string): Promise<Etiqueta>;
  getEtiquetaByValor(valor: string): Promise<Etiqueta | null>;
  listEtiquetas(): Promise<Etiqueta[]>;
  updateEtiqueta(
    id: string,
    input: Partial<CreateEtiquetaInput>
  ): Promise<Etiqueta>;
  deleteEtiqueta(id: string): Promise<void>;
  findOrCreateEtiqueta(valor: string): Promise<Etiqueta>;
}

