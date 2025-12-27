/**
 * Diccionario de errores para asignar etiquetas a producto.
 */

export type RValidationsNamesEtiquetaAssign =
  | "productoNotFound"
  | "errorDeleting"
  | "errorAssigning";

export interface EtiquetaAssignDictionaryItem {
  dictionaryId: number;
  statusCode: number;
  defaultMessage: string;
}

export const etiquetaAssignDictionary: Record<
  RValidationsNamesEtiquetaAssign,
  EtiquetaAssignDictionaryItem
> = {
  productoNotFound: {
    dictionaryId: 2002010,
    statusCode: 404,
    defaultMessage: "Producto no encontrado",
  },
  errorDeleting: {
    dictionaryId: 2002011,
    statusCode: 500,
    defaultMessage: "Error al eliminar etiquetas existentes",
  },
  errorAssigning: {
    dictionaryId: 2002012,
    statusCode: 500,
    defaultMessage: "Error al asignar etiquetas",
  },
};

export interface ErrorDictionaryGenerator<T extends string> {
  create(args: { validationName: T; parameters?: string[] }): Promise<{
    statusCode: number;
    message: string;
  }>;
}

export type DictionaryEtiquetaAssignType = typeof etiquetaAssignDictionary;
