/**
 * Diccionario de errores para remover etiqueta de producto.
 */

export type RValidationsNamesEtiquetaRemove =
  | "productoNotFound"
  | "etiquetaNotFound"
  | "errorRemoving";

export interface EtiquetaRemoveDictionaryItem {
  dictionaryId: number;
  statusCode: number;
  defaultMessage: string;
}

export const etiquetaRemoveDictionary: Record<
  RValidationsNamesEtiquetaRemove,
  EtiquetaRemoveDictionaryItem
> = {
  productoNotFound: {
    dictionaryId: 2002013,
    statusCode: 404,
    defaultMessage: "Producto no encontrado",
  },
  etiquetaNotFound: {
    dictionaryId: 2002014,
    statusCode: 404,
    defaultMessage: "Etiqueta no encontrada en el producto",
  },
  errorRemoving: {
    dictionaryId: 2002015,
    statusCode: 500,
    defaultMessage: "Error al remover etiqueta del producto",
  },
};

export interface ErrorDictionaryGenerator<T extends string> {
  create(args: { validationName: T; parameters?: string[] }): Promise<{
    statusCode: number;
    message: string;
  }>;
}

export type DictionaryEtiquetaRemoveType = typeof etiquetaRemoveDictionary;
