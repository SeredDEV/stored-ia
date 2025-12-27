/**
 * Diccionario de errores para asignar categorías a producto.
 */

export type RValidationsNamesCategoriaAssign =
  | "productoNotFound"
  | "errorDeleting"
  | "errorAssigning";

export interface CategoriaAssignDictionaryItem {
  dictionaryId: number;
  statusCode: number;
  defaultMessage: string;
}

export const categoriaAssignDictionary: Record<
  RValidationsNamesCategoriaAssign,
  CategoriaAssignDictionaryItem
> = {
  productoNotFound: {
    dictionaryId: 2001010,
    statusCode: 404,
    defaultMessage: "Producto no encontrado",
  },
  errorDeleting: {
    dictionaryId: 2001011,
    statusCode: 500,
    defaultMessage: "Error al eliminar categorías existentes",
  },
  errorAssigning: {
    dictionaryId: 2001012,
    statusCode: 500,
    defaultMessage: "Error al asignar categorías",
  },
};

export interface ErrorDictionaryGenerator<T extends string> {
  create(args: { validationName: T; parameters?: string[] }): Promise<{
    statusCode: number;
    message: string;
  }>;
}

export type DictionaryCategoriaAssignType = typeof categoriaAssignDictionary;
