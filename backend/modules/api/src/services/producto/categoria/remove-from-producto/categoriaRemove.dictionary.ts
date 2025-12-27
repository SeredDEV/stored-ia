/**
 * Diccionario de errores para remover categoría de producto.
 */

export type RValidationsNamesCategoriaRemove =
  | "productoNotFound"
  | "categoriaNotFound"
  | "errorRemoving";

export interface CategoriaRemoveDictionaryItem {
  dictionaryId: number;
  statusCode: number;
  defaultMessage: string;
}

export const categoriaRemoveDictionary: Record<
  RValidationsNamesCategoriaRemove,
  CategoriaRemoveDictionaryItem
> = {
  productoNotFound: {
    dictionaryId: 2001013,
    statusCode: 404,
    defaultMessage: "Producto no encontrado",
  },
  categoriaNotFound: {
    dictionaryId: 2001014,
    statusCode: 404,
    defaultMessage: "Categoría no encontrada en el producto",
  },
  errorRemoving: {
    dictionaryId: 2001015,
    statusCode: 500,
    defaultMessage: "Error al remover categoría del producto",
  },
};

export interface ErrorDictionaryGenerator<T extends string> {
  create(args: { validationName: T; parameters?: string[] }): Promise<{
    statusCode: number;
    message: string;
  }>;
}

export type DictionaryCategoriaRemoveType = typeof categoriaRemoveDictionary;
