export interface Precio {
  id: string;
  conjunto_precios_id: string;
  monto: number;
  codigo_moneda: string;
  cantidad_minima: number | null;
  cantidad_maxima: number | null;
  contador_reglas: number;
  fecha_creacion: string;
  fecha_actualizacion: string;
  fecha_eliminacion: string | null;
}

export interface CreatePrecioInput {
  variante_id: string;
  monto: number;
  codigo_moneda: string;
  cantidad_minima?: number;
  cantidad_maxima?: number;
}
