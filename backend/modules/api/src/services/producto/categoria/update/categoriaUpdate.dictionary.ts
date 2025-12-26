/**
 * Diccionario de errores para actualizar categoría.
 */

export type RValidationsNamesCategoriaUpdate = "notFound" | "errorUpdating";

export interface CategoriaUpdateDictionaryItem {
  dictionaryId: number;
  statusCode: number;
  defaultMessage: string;
}

export const categoriaUpdateDictionary: Record<
  RValidationsNamesCategoriaUpdate,
  CategoriaUpdateDictionaryItem
> = {
  notFound: {
    dictionaryId: 2003001,
    statusCode: 404,
    defaultMessage: "Categoría no encontrada",
  },
  errorUpdating: {
    dictionaryId: 2003002,
    statusCode: 500,
    defaultMessage: "Error al actualizar categoría",
  },
};

export interface ErrorDictionaryGenerator<T extends string> {
  create(args: { validationName: T; parameters?: string[] }): Promise<{
    statusCode: number;
    message: string;
  }>;
}

export type DictionaryCategoriaUpdateType = typeof categoriaUpdateDictionary;
